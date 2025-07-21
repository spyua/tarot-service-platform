/**
 * Vite 圖片優化插件
 *
 * 此插件在構建過程中處理圖片優化:
 * - 自動生成 WebP 和 AVIF 格式
 * - 生成不同尺寸的響應式圖片
 * - 優化圖片質量和大小
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

/**
 * 圖片優化插件
 */
function imageOptimizationPlugin(options = {}) {
  const {
    include = /\.(png|jpe?g|gif)$/,
    exclude = /node_modules/,
    sizes = {
      small: 300,
      medium: 600,
      large: 1000,
    },
    formats = ['webp', 'original'],
    quality = 80,
    outputDir = 'dist/images',
  } = options;

  return {
    name: 'vite-plugin-image-optimization',

    async buildStart() {
      // 確保輸出目錄存在
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
    },

    async load(id) {
      // 檢查是否為圖片文件
      if (!id.match(include) || id.match(exclude)) {
        return null;
      }

      const fileExt = path.extname(id).substring(1);
      const fileName = path.basename(id, path.extname(id));
      const fileDir = path.dirname(id);

      // 生成不同尺寸和格式的圖片
      const imageVariants = [];

      try {
        const image = sharp(id);
        const metadata = await image.metadata();

        // 處理每個尺寸
        for (const [sizeName, width] of Object.entries(sizes)) {
          // 處理每個格式
          for (const format of formats) {
            if (format === 'original') {
              // 保持原始格式，只調整尺寸
              const outputPath = path.join(
                outputDir,
                `${fileName}-${sizeName}.${fileExt}`
              );
              await image
                .clone()
                .resize({ width, withoutEnlargement: true })
                .toFile(outputPath);

              imageVariants.push({
                path: outputPath,
                format: fileExt,
                size: sizeName,
                width,
              });
            } else {
              // 轉換為指定格式
              const outputPath = path.join(
                outputDir,
                `${fileName}-${sizeName}.${format}`
              );
              const resizedImage = image
                .clone()
                .resize({ width, withoutEnlargement: true });

              // 根據格式轉換
              if (format === 'webp') {
                await resizedImage.webp({ quality }).toFile(outputPath);
              } else if (format === 'jpg' || format === 'jpeg') {
                await resizedImage.jpeg({ quality }).toFile(outputPath);
              } else if (format === 'png') {
                await resizedImage.png({ quality }).toFile(outputPath);
              } else if (format === 'avif') {
                await resizedImage.avif({ quality }).toFile(outputPath);
              }

              imageVariants.push({
                path: outputPath,
                format,
                size: sizeName,
                width,
              });
            }
          }
        }

        // 生成原始尺寸的不同格式
        for (const format of formats) {
          if (format !== 'original') {
            const outputPath = path.join(outputDir, `${fileName}.${format}`);

            // 根據格式轉換
            if (format === 'webp') {
              await image.clone().webp({ quality }).toFile(outputPath);
            } else if (format === 'jpg' || format === 'jpeg') {
              await image.clone().jpeg({ quality }).toFile(outputPath);
            } else if (format === 'png') {
              await image.clone().png({ quality }).toFile(outputPath);
            } else if (format === 'avif') {
              await image.clone().avif({ quality }).toFile(outputPath);
            }

            imageVariants.push({
              path: outputPath,
              format,
              size: 'original',
              width: metadata.width,
            });
          }
        }

        // 生成 JavaScript 模塊，導出圖片路徑和尺寸信息
        return `
          const imageVariants = ${JSON.stringify(imageVariants)};
          export default {
            src: ${JSON.stringify(id)},
            variants: imageVariants,
            getSrcSet: (format) => {
              const variants = imageVariants.filter(v => v.format === (format || '${fileExt}'));
              return variants
                .map(v => \`\${v.path} \${v.width}w\`)
                .join(', ');
            },
            getResponsiveImage: (size, format) => {
              const variant = imageVariants.find(v => 
                v.size === (size || 'original') && 
                v.format === (format || '${fileExt}')
              );
              return variant ? variant.path : ${JSON.stringify(id)};
            }
          };
        `;
      } catch (error) {
        this.error(`圖片處理錯誤 (${id}): ${error.message}`);
        return null;
      }
    },
  };
}

// Export as ES module
export default imageOptimizationPlugin;
