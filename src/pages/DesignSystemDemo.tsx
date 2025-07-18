import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Modal,
  ModalBody,
  ModalFooter,
  LoadingSpinner,
  Grid,
  GridItem,
  Container,
  AnimatedContainer
} from '@/components/common';

const DesignSystemDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <Container size="xl" className="py-8">
      <AnimatedContainer>
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gradient font-primary mb-4">
              設計系統展示
            </h1>
            <p className="text-lg text-gray-600 font-secondary">
              塔羅占卜應用程式的設計組件庫
            </p>
          </div>

          {/* Buttons Section */}
          <section>
            <h2 className="text-2xl font-semibold font-primary mb-6">按鈕組件</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">主要按鈕</Button>
                <Button variant="secondary">次要按鈕</Button>
                <Button variant="accent">強調按鈕</Button>
                <Button variant="outline">邊框按鈕</Button>
                <Button variant="ghost">幽靈按鈕</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="sm">小型</Button>
                <Button variant="primary" size="md">中型</Button>
                <Button variant="primary" size="lg">大型</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" loading={loading} onClick={handleLoadingTest}>
                  {loading ? '載入中...' : '測試載入'}
                </Button>
                <Button variant="primary" disabled>停用按鈕</Button>
                <Button variant="primary" fullWidth>全寬按鈕</Button>
              </div>
            </div>
          </section>

          {/* Cards Section */}
          <section>
            <h2 className="text-2xl font-semibold font-primary mb-6">卡片組件</h2>
            <Grid cols={2} gap="lg" responsive={{ xs: 1, md: 2 }}>
              <GridItem>
                <Card variant="default" padding="lg">
                  <CardHeader>
                    <CardTitle>預設卡片</CardTitle>
                    <CardDescription>這是一個預設樣式的卡片</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 font-secondary">
                      卡片內容區域，可以放置任何內容。
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="primary" size="sm">操作</Button>
                  </CardFooter>
                </Card>
              </GridItem>
              
              <GridItem>
                <Card variant="elevated" padding="lg" hoverable>
                  <CardHeader>
                    <CardTitle>提升卡片</CardTitle>
                    <CardDescription>具有懸停效果的卡片</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 font-secondary">
                      懸停時會有動畫效果。
                    </p>
                  </CardContent>
                </Card>
              </GridItem>

              <GridItem>
                <Card variant="outlined" padding="lg">
                  <CardHeader>
                    <CardTitle>邊框卡片</CardTitle>
                    <CardDescription>具有紫色邊框的卡片</CardDescription>
                  </CardHeader>
                </Card>
              </GridItem>

              <GridItem>
                <Card variant="glass" padding="lg">
                  <CardHeader>
                    <CardTitle>玻璃卡片</CardTitle>
                    <CardDescription>半透明玻璃效果</CardDescription>
                  </CardHeader>
                </Card>
              </GridItem>
            </Grid>
          </section>

          {/* Loading Section */}
          <section>
            <h2 className="text-2xl font-semibold font-primary mb-6">載入組件</h2>
            <Grid cols={3} gap="lg" responsive={{ xs: 1, md: 3 }}>
              <GridItem>
                <Card padding="lg">
                  <CardTitle className="mb-4">旋轉載入器</CardTitle>
                  <LoadingSpinner variant="spinner" size="md" />
                </Card>
              </GridItem>
              
              <GridItem>
                <Card padding="lg">
                  <CardTitle className="mb-4">點狀載入器</CardTitle>
                  <LoadingSpinner variant="dots" size="md" />
                </Card>
              </GridItem>
              
              <GridItem>
                <Card padding="lg">
                  <CardTitle className="mb-4">脈衝載入器</CardTitle>
                  <LoadingSpinner variant="pulse" size="md" text="載入中..." />
                </Card>
              </GridItem>
            </Grid>
          </section>

          {/* Modal Section */}
          <section>
            <h2 className="text-2xl font-semibold font-primary mb-6">對話框組件</h2>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              開啟對話框
            </Button>
            
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="範例對話框"
              size="md"
            >
              <ModalBody>
                <p className="text-gray-600 font-secondary">
                  這是一個範例對話框，展示了對話框組件的基本功能。
                  您可以點擊背景或按 ESC 鍵來關閉它。
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  取消
                </Button>
                <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                  確認
                </Button>
              </ModalFooter>
            </Modal>
          </section>

          {/* Grid System Section */}
          <section>
            <h2 className="text-2xl font-semibold font-primary mb-6">網格系統</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium font-primary mb-3">響應式網格</h3>
                <Grid cols={4} gap="md" responsive={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
                  {[1, 2, 3, 4].map((item) => (
                    <GridItem key={item}>
                      <Card padding="md" className="text-center">
                        <p className="font-secondary">項目 {item}</p>
                      </Card>
                    </GridItem>
                  ))}
                </Grid>
              </div>
              
              <div>
                <h3 className="text-lg font-medium font-primary mb-3">跨欄網格</h3>
                <Grid cols={6} gap="md">
                  <GridItem span={2}>
                    <Card padding="md" className="text-center">
                      <p className="font-secondary">跨 2 欄</p>
                    </Card>
                  </GridItem>
                  <GridItem span={4}>
                    <Card padding="md" className="text-center">
                      <p className="font-secondary">跨 4 欄</p>
                    </Card>
                  </GridItem>
                  <GridItem span={3}>
                    <Card padding="md" className="text-center">
                      <p className="font-secondary">跨 3 欄</p>
                    </Card>
                  </GridItem>
                  <GridItem span={3}>
                    <Card padding="md" className="text-center">
                      <p className="font-secondary">跨 3 欄</p>
                    </Card>
                  </GridItem>
                </Grid>
              </div>
            </div>
          </section>

          {/* Typography Section */}
          <section>
            <h2 className="text-2xl font-semibold font-primary mb-6">字體系統</h2>
            <Card padding="lg">
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bold font-primary text-gradient">
                    主標題 - Noto Serif TC
                  </h1>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold font-primary text-gray-900">
                    副標題 - Noto Serif TC
                  </h2>
                </div>
                <div>
                  <p className="text-lg font-secondary text-gray-700">
                    內文段落 - Inter 字體，適合長篇閱讀的現代無襯線字體。
                  </p>
                </div>
                <div>
                  <p className="text-sm font-secondary text-gray-600">
                    小字說明文字 - Inter 字體，用於輔助說明。
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* Color Palette Section */}
          <section>
            <h2 className="text-2xl font-semibold font-primary mb-6">色彩系統</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium font-primary mb-3">主色調 (Primary)</h3>
                <div className="flex flex-wrap gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div
                      key={shade}
                      className={`w-16 h-16 rounded-lg bg-primary-${shade} flex items-center justify-center`}
                    >
                      <span className={`text-xs font-secondary ${shade >= 500 ? 'text-white' : 'text-gray-900'}`}>
                        {shade}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium font-primary mb-3">輔助色 (Accent)</h3>
                <div className="flex flex-wrap gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div
                      key={shade}
                      className={`w-16 h-16 rounded-lg bg-accent-${shade} flex items-center justify-center`}
                    >
                      <span className={`text-xs font-secondary ${shade >= 500 ? 'text-white' : 'text-gray-900'}`}>
                        {shade}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </AnimatedContainer>
    </Container>
  );
};

export default DesignSystemDemo;