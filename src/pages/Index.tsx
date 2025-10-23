import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const products = [
    { id: 1, name: 'Молоко 3.2%', price: 89, category: 'Молочные продукты', discount: 10 },
    { id: 2, name: 'Хлеб Бородинский', price: 45, category: 'Хлебобулочные изделия' },
    { id: 3, name: 'Яблоки Гренни Смит', price: 120, category: 'Фрукты', discount: 15 },
    { id: 4, name: 'Сыр Российский', price: 380, category: 'Молочные продукты' },
    { id: 5, name: 'Куриное филе', price: 420, category: 'Мясо' },
    { id: 6, name: 'Томаты черри', price: 180, category: 'Овощи', discount: 20 },
  ];

  const addToCart = (id: number) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id] -= 1;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);

  const cartItems = Object.entries(cart).map(([id, count]) => {
    const product = products.find(p => p.id === Number(id))!;
    const finalPrice = product.discount 
      ? product.price - (product.price * product.discount / 100)
      : product.price;
    return { product, count, finalPrice };
  });

  const totalPrice = cartItems.reduce((sum, item) => sum + item.finalPrice * item.count, 0);

  const categories = ['Все', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = products
    .filter(p => selectedCategory === 'Все' || p.category === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b sticky top-0 bg-white z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/files/067be470-df9a-4a18-8e9a-dc5f09958f0d.png" 
                alt="Метрополис" 
                className="h-12"
              />
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#catalog" className="text-foreground hover:text-primary transition-colors">Каталог</a>
              <a href="#promotions" className="text-foreground hover:text-primary transition-colors">Акции</a>
              <a href="#delivery" className="text-foreground hover:text-primary transition-colors">Доставка</a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">О магазине</a>
              <a href="#contacts" className="text-foreground hover:text-primary transition-colors">Контакты</a>
            </nav>

            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
                    <Icon name="ShoppingCart" size={64} className="text-gray-300 mb-4" />
                    <p className="text-muted-foreground">Корзина пуста</p>
                  </div>
                ) : (
                  <div className="flex flex-col h-[calc(100vh-120px)]">
                    <div className="flex-1 overflow-y-auto py-6 space-y-4">
                      {cartItems.map(({ product, count, finalPrice }) => (
                        <div key={product.id} className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon name="Package" size={32} className="text-gray-300" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{product.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{finalPrice} ₽</p>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => removeFromCart(product.id)}
                                size="sm"
                                variant="outline"
                                className="w-7 h-7 p-0"
                              >
                                <Icon name="Minus" size={14} />
                              </Button>
                              <span className="font-medium min-w-[24px] text-center">{count}</span>
                              <Button
                                onClick={() => addToCart(product.id)}
                                size="sm"
                                className="bg-primary hover:bg-primary/90 w-7 h-7 p-0"
                              >
                                <Icon name="Plus" size={14} />
                              </Button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{finalPrice * count} ₽</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Итого:</span>
                        <span>{totalPrice} ₽</span>
                      </div>
                      <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                        Оформить заказ
                      </Button>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Свежие продукты с доставкой
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Качественные продукты по доступным ценам. Доставка за 2 часа
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Icon name="ShoppingBag" size={20} className="mr-2" />
              Смотреть каталог
            </Button>
          </div>
        </div>
      </section>

      <section id="promotions" className="py-16 bg-accent/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Акции и спецпредложения</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Percent" size={32} className="text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Скидки до 20%</h3>
              <p className="text-muted-foreground">На молочные продукты и овощи</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Truck" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Бесплатная доставка</h3>
              <p className="text-muted-foreground">При заказе от 2000 ₽</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Gift" size={32} className="text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Подарок к заказу</h3>
              <p className="text-muted-foreground">При первом заказе свыше 3000 ₽</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="catalog" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Популярные товары</h2>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-12 max-w-4xl mx-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-primary hover:bg-primary/90' : ''}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredProducts.map((product) => {
              const finalPrice = product.discount 
                ? product.price - (product.price * product.discount / 100)
                : product.price;
              
              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gray-50 h-48 flex items-center justify-center relative">
                    <Icon name="Package" size={64} className="text-gray-300" />
                    {product.discount && (
                      <Badge className="absolute top-3 right-3 bg-accent">
                        -{product.discount}%
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
                    <h3 className="font-semibold text-lg mb-3">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        {product.discount ? (
                          <div>
                            <div className="text-2xl font-bold text-foreground">{finalPrice} ₽</div>
                            <div className="text-sm text-muted-foreground line-through">{product.price} ₽</div>
                          </div>
                        ) : (
                          <div className="text-2xl font-bold text-foreground">{product.price} ₽</div>
                        )}
                      </div>
                      
                      {cart[product.id] ? (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => removeFromCart(product.id)}
                            size="sm"
                            variant="outline"
                            className="w-8 h-8 p-0"
                          >
                            <Icon name="Minus" size={16} />
                          </Button>
                          <span className="font-semibold min-w-[24px] text-center">{cart[product.id]}</span>
                          <Button
                            onClick={() => addToCart(product.id)}
                            size="sm"
                            className="bg-primary hover:bg-primary/90 w-8 h-8 p-0"
                          >
                            <Icon name="Plus" size={16} />
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => addToCart(product.id)}
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Icon name="Plus" size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="delivery" className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Условия доставки</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="p-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Clock" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Быстрая доставка</h3>
                  <p className="text-muted-foreground">Доставим ваш заказ в течение 2 часов. Работаем с 8:00 до 22:00</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="MapPin" size={24} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Зона доставки</h3>
                  <p className="text-muted-foreground">Доставка по всему городу. Стоимость от 150 ₽, бесплатно при заказе от 2000 ₽</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="ShieldCheck" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Гарантия качества</h3>
                  <p className="text-muted-foreground">Проверяем каждый продукт перед доставкой. Замена товара при любых проблемах</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="about" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">О магазине</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Метрополис — это современный продуктовый магазин с широким ассортиментом свежих продуктов. 
              Мы работаем напрямую с проверенными поставщиками, чтобы гарантировать качество каждого товара.
            </p>
            <p className="text-lg text-muted-foreground">
              Наша миссия — делать покупку продуктов удобной, быстрой и приятной. 
              Заказывайте онлайн и получайте всё необходимое прямо к двери.
            </p>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Контакты</h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Phone" size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Телефон</h3>
              <p className="text-muted-foreground">+7 (495) 123-45-67</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Mail" size={24} className="text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground">info@metropolis.ru</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="MapPin" size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Адрес</h3>
              <p className="text-muted-foreground">г. Москва, ул. Примерная, 123</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <img 
            src="https://cdn.poehali.dev/files/067be470-df9a-4a18-8e9a-dc5f09958f0d.png" 
            alt="Метрополис" 
            className="h-10 mx-auto mb-4 brightness-0 invert"
          />
          <p className="text-sm text-gray-300">© 2024 Метрополис. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}