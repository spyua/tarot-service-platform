/**
 * 生成響應式圖片
 *
 * 此腳本用於將原始塔羅牌圖片轉換為多種尺寸和格式
 * 支援 WebP、AVIF 和傳統格式 (JPG/PNG)
 *
 * 使用方法:
 * node scripts/generateResponsiveImages.js
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// ES modules don't have __dirname, so we need to create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const config = {
  // 來源圖片目錄
  sourceDir: path.join(__dirname, '..', 'public', 'images'),
  // 輸出目錄
  outputDir: path.join(__dirname, '..', 'public', 'images'),
  // 尺寸配置
  sizes: {
    small: 300,
    medium: 600,
    large: 1000,
    // 原始尺寸不調整大小，只轉換格式
  },
  // 格式配置
  formats: [
    {
      name: 'webp',
      options: { quality: 85 },
    },
    {
      name: 'jpg',
      options: { quality: 85, progressive: true },
    },
    // 可選: AVIF 格式 (更好的壓縮但支援較少)
    // {
    //   name: 'avif',
    //   options: { quality: 80 }
    // }
  ],
  // 是否保留原始圖片
  keepOriginal: true,
};

// 確保輸出目錄存在
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

/**
 * 處理單個圖片
 */
async function processImage(filePath) {
  const fileName = path.basename(filePath);
  const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
  const image = sharp(filePath);
  const metadata = await image.metadata();

  console.log(`處理圖片: ${fileName}`);

  // 生成不同尺寸和格式的圖片
  for (const [sizeName, width] of Object.entries(config.sizes)) {
    for (const format of config.formats) {
      const outputFileName = `${fileNameWithoutExt}-${sizeName}.${format.name}`;
      const outputPath = path.join(config.outputDir, outputFileName);

      try {
        // 調整大小並轉換格式
        const resizedImage = image
          .clone()
          .resize({ width, withoutEnlargement: true });

        // 根據格式轉換
        if (format.name === 'webp') {
          await resizedImage.webp(format.options).toFile(outputPath);
        } else if (format.name === 'jpg' || format.name === 'jpeg') {
          await resizedImage.jpeg(format.options).toFile(outputPath);
        } else if (format.name === 'png') {
          await resizedImage.png(format.options).toFile(outputPath);
        } else if (format.name === 'avif') {
          await resizedImage.avif(format.options).toFile(outputPath);
        }

        console.log(`  ✓ 已生成: ${outputFileName}`);
      } catch (error) {
        console.error(`  ✗ 錯誤: ${outputFileName} - ${error.message}`);
      }
    }
  }

  // 生成原始尺寸的不同格式
  for (const format of config.formats) {
    const outputFileName = `${fileNameWithoutExt}.${format.name}`;
    const outputPath = path.join(config.outputDir, outputFileName);

    try {
      // 根據格式轉換
      if (format.name === 'webp') {
        await image.clone().webp(format.options).toFile(outputPath);
      } else if (format.name === 'jpg' || format.name === 'jpeg') {
        await image.clone().jpeg(format.options).toFile(outputPath);
      } else if (format.name === 'png') {
        await image.clone().png(format.options).toFile(outputPath);
      } else if (format.name === 'avif') {
        await image.clone().avif(format.options).toFile(outputPath);
      }

      console.log(`  ✓ 已生成原始尺寸: ${outputFileName}`);
    } catch (error) {
      console.error(`  ✗ 錯誤: ${outputFileName} - ${error.message}`);
    }
  }

  // 如果需要保留原始圖片，複製到輸出目錄
  if (config.keepOriginal) {
    const outputPath = path.join(config.outputDir, fileName);
    fs.copyFileSync(filePath, outputPath);
    console.log(`  ✓ 已複製原始圖片: ${fileName}`);
  }
}

/**
 * 處理目錄中的所有圖片
 */
async function processDirectory() {
  try {
    // 檢查來源目錄是否存在
    if (!fs.existsSync(config.sourceDir)) {
      console.error(`錯誤: 來源目錄 "${config.sourceDir}" 不存在`);
      // 創建目錄
      fs.mkdirSync(config.sourceDir, { recursive: true });

      // 如果沒有圖片，創建一個示例圖片
      const sampleImagePath = path.join(config.sourceDir, 'sample_card.svg');
      if (!fs.existsSync(sampleImagePath)) {
        // 創建一個簡單的SVG示例卡片
        const sampleSvg = `<svg width="600" height="1000" xmlns="http://www.w3.org/2000/svg">
          <rect width="600" height="1000" fill="#4b2e83" rx="20" ry="20"/>
          <rect x="30" y="30" width="540" height="940" fill="#6b4e93" rx="10" ry="10" stroke="#ffd700" stroke-width="5"/>
          <text x="300" y="500" font-family="serif" font-size="60" text-anchor="middle" fill="#ffd700">塔羅牌</text>
          <text x="300" y="580" font-family="serif" font-size="40" text-anchor="middle" fill="#ffd700">示例卡片</text>
          <circle cx="300" cy="300" r="100" fill="none" stroke="#ffd700" stroke-width="5"/>
          <path d="M300,200 L300,400 M200,300 L400,300" stroke="#ffd700" stroke-width="5"/>
          <circle cx="300" cy="700" r="100" fill="none" stroke="#ffd700" stroke-width="5"/>
          <path d="M250,650 L350,750 M250,750 L350,650" stroke="#ffd700" stroke-width="5"/>
        </svg>`;

        fs.writeFileSync(sampleImagePath, sampleSvg);
        console.log(`已創建示例圖片: ${sampleImagePath}`);
      }
    }

    // 確保輸出目錄存在
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }

    // 讀取目錄中的所有文件
    const files = fs.readdirSync(config.sourceDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      // 只處理原始圖片，避免處理已經生成的尺寸圖片
      const isOriginalFormat = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.svg',
      ].includes(ext);
      // 排除已經處理過的圖片（包含尺寸標記的文件名）
      const isNotProcessed =
        !file.includes('-small.') &&
        !file.includes('-medium.') &&
        !file.includes('-large.');
      return isOriginalFormat && isNotProcessed;
    });

    console.log(`找到 ${imageFiles.length} 個圖片文件`);

    // 處理每個圖片
    for (const file of imageFiles) {
      const filePath = path.join(config.sourceDir, file);
      await processImage(filePath);
    }

    console.log('所有圖片處理完成!');
  } catch (error) {
    console.error('處理圖片時發生錯誤:', error);
  }
}

// 執行腳本
processDirectory();
