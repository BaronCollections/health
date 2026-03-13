"use client"
import { SharedNav } from "@/components/shared-nav"
import { ChevronLeft, Minus, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const initialCartItems = [
  {
    id: 1,
    name: "还原型辅酶 Q10",
    desc: "吸烟会损害你的心血管。辅酶Q10是强效的抗氧化剂",
    price: 147,
    originalPrice: 149,
    quantity: 1,
    image: "from-pink-300 to-pink-400",
  },
  {
    id: 2,
    name: "Daily益生菌",
    desc: "补充益生菌能帮助你弥补食源摄入不足",
    price: 187,
    originalPrice: 189,
    quantity: 1,
    image: "from-white to-gray-100",
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col max-w-md mx-auto relative">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-20">
        <Link href="/product" className="p-1">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </Link>
        <span className="text-base font-medium text-foreground">购物车</span>
        <div className="w-6" />
      </div>

      {/* 购物车列表 */}
      <div className="flex-1 px-4 py-4 space-y-3">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl text-muted-foreground">:(</span>
            </div>
            <p className="text-muted-foreground">购物车是空的</p>
            <Link href="/product" className="mt-4 px-6 py-2 bg-primary rounded-full text-sm font-medium text-foreground">
              去选购
            </Link>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4">
              <div className="flex gap-3">
                {/* 补剂图片 */}
                <div className="w-20 h-20 bg-[#FFF8E6] rounded-lg flex items-center justify-center">
                  <div className={`w-6 h-14 rounded-full bg-gradient-to-b ${item.image} shadow-sm`} />
                </div>
                
                {/* 商品信息 */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-foreground text-sm">{item.name}</h3>
                    <button onClick={() => removeItem(item.id)} className="p-1 text-muted-foreground">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.desc}</p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-primary font-bold">{item.price}</span>
                      <span className="text-xs text-primary">元/月</span>
                      <span className="text-xs text-muted-foreground line-through ml-1">{item.originalPrice}元</span>
                    </div>
                    
                    {/* 数量控制 */}
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-full border border-border flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3 text-muted-foreground" />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 底部结算栏 */}
      {cartItems.length > 0 && (
        <div className="sticky bottom-14 bg-white border-t border-border px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">查看评价</p>
            <p className="text-xs text-muted-foreground">23,888 条</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-6 py-2.5 border border-foreground rounded-full text-sm font-medium text-foreground">
              加购物车
            </button>
            <button className="px-6 py-2.5 bg-primary rounded-full text-sm font-medium text-foreground">
              结算 ({totalItems}颗/天)
            </button>
          </div>
        </div>
      )}

      {/* 底部间距 */}
      <div className="pb-14" />

      <SharedNav />
    </div>
  )
}
