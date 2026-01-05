import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Plus, 
  Eye, 
  Edit, 
  MoreVertical,
  BarChart3,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { title: "Total Revenue", value: "₦1,245,000", change: "+12.5%", icon: DollarSign, positive: true },
  { title: "Total Orders", value: "156", change: "+8.2%", icon: ShoppingCart, positive: true },
  { title: "Products Listed", value: "24", change: "+2", icon: Package, positive: true },
  { title: "Store Views", value: "2,340", change: "+18.7%", icon: Eye, positive: true },
];

const recentOrders = [
  { id: "#1234", product: "Ankara Tote Bag", customer: "Adaeze O.", amount: "₦25,000", status: "Completed" },
  { id: "#1233", product: "Beaded Necklace", customer: "Kwame M.", amount: "₦15,000", status: "Shipped" },
  { id: "#1232", product: "African Wall Art", customer: "Fatima H.", amount: "₦35,000", status: "Processing" },
  { id: "#1231", product: "Shea Butter Set", customer: "James A.", amount: "₦12,000", status: "Completed" },
];

const products = [
  { name: "Handmade Ankara Tote Bag", price: "₦25,000", stock: 15, sales: 45, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop" },
  { name: "Beaded Statement Necklace", price: "₦15,000", stock: 8, sales: 32, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop" },
  { name: "African Print Wall Art", price: "₦35,000", stock: 12, sales: 18, image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=100&h=100&fit=crop" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Seller Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's how your store is performing.</p>
            </div>
            <Button variant="hero" asChild>
              <Link to="#">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title} className="card-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <Card className="lg:col-span-2 card-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{order.product}</p>
                          <p className="text-sm text-muted-foreground">{order.customer} • {order.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{order.amount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start h-12">
                  <Plus className="w-4 h-4 mr-3" />
                  Add New Product
                </Button>
                <Button variant="outline" className="w-full justify-start h-12">
                  <BarChart3 className="w-4 h-4 mr-3" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start h-12">
                  <Users className="w-4 h-4 mr-3" />
                  Manage Customers
                </Button>
                <Button variant="outline" className="w-full justify-start h-12">
                  <Edit className="w-4 h-4 mr-3" />
                  Edit Store Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Products */}
          <Card className="mt-6 card-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Your Products</CardTitle>
              <Button variant="ghost" size="sm">Manage All</Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-muted-foreground border-b">
                      <th className="pb-4 font-medium">Product</th>
                      <th className="pb-4 font-medium">Price</th>
                      <th className="pb-4 font-medium">Stock</th>
                      <th className="pb-4 font-medium">Sales</th>
                      <th className="pb-4 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.name} className="border-b last:border-0">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-4 font-semibold">{product.price}</td>
                        <td className="py-4">{product.stock} units</td>
                        <td className="py-4">{product.sales} sold</td>
                        <td className="py-4">
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
