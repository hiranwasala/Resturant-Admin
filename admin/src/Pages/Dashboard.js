import React ,{ useEffect} from 'react'
import Header from '../components/Header'
import Trolley from '../assets/dashboard/icons8-trolley-64.png';
import Coins from '../assets/dashboard/icons8-coins-64.png';
import CheckList from '../assets/dashboard/checklist.png';
import Customers from '../assets/dashboard/customer-review.png'
import Spinner from '../components/Spinner';
import RadialChart from '../charts/RadialChart';
import '../Pages/style.css'
import SideMenu from '../components/SideMenu';
import { useGetProductsQuery } from '../slices/productApiSlice';
import { useGetInventoriesQuery } from '../slices/inventoryApiSlice';
import { useGetUsersQuery } from '../slices/usersApiSlice';
import DonutChart from '../charts/Chart';
import AreaChart from '../charts/AreaChart';
import { useGetOrdersQuery } from '../slices/ordersApiSlice';


const Dashboard = () => {
  const { data: productList, isLoading, error } = useGetProductsQuery();
  const { data: inventoryList, isLoading: inventoryLoading, error: inventoryError } = useGetInventoriesQuery();
  const { data: users, isLoading: loadingUser, error: loadingUserError } = useGetUsersQuery();
  const { data: orders, isLoading: loadingOrder, error: loadingError } = useGetOrdersQuery();



  if (loadingUser || loadingOrder || isLoading || inventoryLoading) {
    return <div className='flex justify-center items-center min-h-screen'>
            <Spinner/>
          </div>;
  }

  if (loadingUserError || loadingError || error || inventoryError) {
    return <div>{(loadingUserError || loadingError || error || inventoryError).message}</div>;
  }

  const totalCustomers = users ? users.length : 0;

  const delivered = orders?.filter((order) => order.isDelivered).length;
  const pending = orders?.filter(order => !order.isDelivered && !order.isCancelled).length;
  const cancelled = orders?.filter((order) => order.isCancelled).length;
  const totalRevenue = orders?.filter((order) => order.isPaid)
    .reduce((total, order) => total + (order.totalPrice || 0), 0);

    const today = new Date();
    const past30Days = new Date(today);
    past30Days.setDate(past30Days.getDate() - 30);
  
    const salesData = orders?.filter(order => {
      const orderDate = new Date(order.createdAt);
      return order.isPaid && orderDate >= past30Days && orderDate <= today;
    }).map(order => ({
      date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: order.totalPrice
    })) || [];
    console.log("Sales Data:", salesData);

  const totalOrders = pending + cancelled + delivered;

  const data2 = [pending, delivered, cancelled];
  const data3 = salesData;

 

  const itemCountByStock = (inventoryList, groupName) => {
    return inventoryList?.filter((inventory) => inventory.itemGroup === groupName)
      .reduce((total, item) => total + (item.inStock || 0), 0);
  }

  const meat = itemCountByStock(inventoryList, "Meat");
  const vegetables = itemCountByStock(inventoryList, "Vegetables");
  const dairy = itemCountByStock(inventoryList, "Dairy");
  const dryGoods = itemCountByStock(inventoryList, "Dry goods");
  const seaFood = itemCountByStock(inventoryList, "Sea food");
  const spices = itemCountByStock(inventoryList, "Spices");
  const bakedGoods = itemCountByStock(inventoryList, "Bake Goods");
  const beverages = itemCountByStock(inventoryList, "Beverages");
  const oils = itemCountByStock(inventoryList, "Oils");
  const eggs = itemCountByStock(inventoryList, "Eggs");
  const fruits = itemCountByStock(inventoryList, "Fruits");

  const data1 = [meat, vegetables, dairy, dryGoods, seaFood, spices, bakedGoods, beverages, oils, eggs, fruits];
  const colors1 = [
    "#FF0000", 
    "#00FF00", 
    "#0000FF", 
    "#FFFF00", 
    "#FF00FF", 
    "#00FFFF", 
    "#FFA500", 
    "#800080", 
    "#808000", 
    "#008080",
    "#FFC0CB",
  ];
  
  const labels1 = [
    "Meat",
    "Vegetables",
    "Dairy",
    "Dry goods",
    "Sea food",
    "Spices and Condiments",
    "Baked goods",
    "Beverages",
    "Oils",
    "Eggs",
    "Fruits",
  ];
  const chartTitle1 = "Total Inventory";

  const totalInventoryValue = inventoryList?.reduce((total, item) => total + ((item.costPerUnit || 0) * (item.inStock || 0)), 0);

  const totalItems = productList ? productList.length : 0;

  const lowStockItems = inventoryList ?. filter(inventory => inventory.inStock <= 50).length

  return (
    <div>
  
      <Header title='Dashboard' />
      <SideMenu />
      <div className="p-4 sm:ml-64">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className='col-span-1'>
          
          <div className="flex justify-between shadow items-center h-24 rounded-2xl total ">
                <div>
                  <p className="text-2xl ml-5 mt-2 mb-0 font-medium text-center">
                    Total Orders
                  </p>
                  <p className="text-3xl ml-5 font-bold text-center">
                    {totalOrders}
                  </p>
                </div>
                <img src={CheckList} className='mr-2 w-16 h-16' />
              </div>
          </div>
          <div className='col-span-2'>
              <div className='flex items-center justify-between'>
              <div className="flex justify-between shadow items-center h-24 rounded-2xl total w-[330px] mr-6">
                <div>
                  <p className="text-2xl ml-5 mt-2 mb-0 font-medium">
                    Total Revenue
                  </p>
                  <p className="text-2xl ml-5 font-bold">
                    {`LKR ${totalRevenue.toFixed(2)}`}
                  </p>
                </div>
                <img src={Coins} className='mr-2 w-20 h-20' />
              </div>
              <div className="flex justify-between shadow items-center h-24 rounded-2xl total">
            <div>
              <h2 className="text-2xl ml-5 mt-2 mb-0 font-medium text-center">
                Total Items
              </h2>
              <p className="text-3xl ml-5 font-bold text-center">
                {isLoading ? 'Loading...' : totalItems}
              </p>
            </div>
            <img src={Trolley} className='mr-2 w-18 h-18 ml-2' />
          </div>
              </div>
          </div>
          
          <div className="flex justify-between shadow items-center h-24 rounded-2xl total">
            <div>
              <p className="text-2xl ml-2 mt-2 mb-0 font-medium text-center">
                Total Customers
              </p>
              <p className="text-3xl ml-2 font-bold text-center">
                {totalCustomers}
              </p>
            </div>
            <img src={Customers} className='mr-2 w-16 h-16' />
          </div>
        </div>
        <div className="h-auto mb-4 rounded-2xl text-start chart shadow-2xl pt-2">
          <p className="text-2xl ml-4 mt-2 mb-0 font-medium">
            Inventory Overview
          </p>
          <div className='flex flex-row justify-center items-start w-full mt-4'>
            <div className='flex flex-row justify-center w-full'>
              {data1 && colors1 && labels1 && (
                <DonutChart series={data1} colors={colors1} labels={labels1} chartTitle={chartTitle1} />
              )}
              {!data1 && <p>Data for chart is not available</p>}
              <div className='grid grid-cols-2 gap-16'>
                <div className='col mb-4 ml-12'>
                  <div className='flex items-center mb-4'> 
                    <div className='w-4 h-4 bg-meat rounded-lg mr-4'></div> 
                    <span className="text-2xl font-medium">Meat</span> 
                  </div>
                  <div className='flex items-center mb-4'> 
                    <div className='w-4 h-4 bg-vegetables rounded-lg mr-4'></div> 
                    <span className="text-2xl font-medium">Vegetables</span> 
                  </div>
                  <div className='flex items-center mb-4'> 
                    <div className='w-4 h-4 bg-diary rounded-lg mr-4'></div> 
                    <span className="text-2xl font-medium">Diary</span> 
                  </div>
                  <div className='flex items-center mb-4'> 
                    <div className='w-4 h-4 bg-dryGoods rounded-lg mr-4'></div> 
                    <span className="text-2xl font-medium">Dry goods</span> 
                  </div>
                  <div className='flex items-center mb-4'> 
                    <div className='w-4 h-4 bg-seafood rounded-lg mr-4'></div> 
                    <span className="text-2xl font-medium">Sea food</span> 
                  </div>
                  <div className='flex items-center mb-4'> 
                    <div className='w-4 h-4 bg-fruits rounded-lg mr-4'></div> 
                    <span className="text-2xl font-medium">Fruits</span> 
                  </div>
                </div>
                <div className='col mb-4 ml-6'>
                  <div className='flex items-center mb-4'> 
                    <div className='w-4 h-4 bg-spices rounded-lg mr-4'></div> 
                    <span className="text-2xl font-medium">Spices</span> 
                  </div>
                  <div className='flex items-center mb-4'> 
                    <div className='w-4 h-4 bg-bakedGoods rounded-lg mr-4'></div> 
                    <span className="text-2xl font-medium">Bake goods</span> 
                  </div>
                  <div className='flex items-center mb-4'> 
                    <div className='w-4 h-4 bg-beverages rounded-lg mr-4'></div> 
                    <span className="text-2xl font-medium">Beverages</span> 
                  </div>
                  <div className='flex items-center mb-4'> 
                    <div className='w-4 h-4 bg-oils rounded-lg mr-4'></div> 
                    <span className="text-2xl font-medium">Oils</span> 
                  </div>
                  <div className='flex items-center mb-4'> 
                    <div className='w-4 h-4 bg-eggs rounded-lg mr-4'></div> 
                    <span className="text-2xl font-medium">Eggs</span> 
                  </div>
                </div>
              </div>
            </div>
            <div className='w-1/3 '>
              <h3 className='text-2xl font-normal text-yellow-400 text-center'>Total Inventory Value</h3>
              <h3 className='text-3xl mb-6 text-center'>{`LKR ${totalInventoryValue.toFixed(2)}`}</h3>
              <h3 className='text-2xl font-normal text-yellow-400 text-center'>Low Stock Items</h3>
              <h3 className='text-3xl mb-8 text-center'>{lowStockItems}</h3>
              
                  <div className='mr-6 '>
                    <div className='flex justify-between items-center'>
                    <span className="text-xl font-medium text-yellow-400">Item</span>
                    <span className="text-xl font-medium text-yellow-400">In Stock</span>
                    </div>
                    <div className='max-h-24 overflow-y-auto custom-scrollbar text-center mt-4'>
                      {inventoryList && inventoryList.filter((inventory)=> inventory.inStock <= 50).map((inventory, index)=> (
                        <>
                        <div key={index} className='flex justify-between items-center mb-3'> 
                          <span className="text-lg font-normal">{inventory.itemName}</span> 
                          <span className="text-lg font-normal">{inventory.inStock}</span>
                        </div>
                        </>
                      ))}
                      
                      
                    </div>
                  </div>
              
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="col rounded-2xl h-86 radial-chart shadow-2xl">
            <p className="text-2xl ml-4 mt-2 mb-0 font-medium">
              Orders
            </p>
            <div className='flex flex-row items-center'>
              {data2 && (
                <RadialChart data={data2}/>
              )}
              <div className='flex flex-col ml-4 mb-4 justify-center'>
                <div className='flex items-center mb-4'> 
                  <div className='w-4 h-4 bg-radial-1 rounded-lg mr-4'></div> 
                  <span className="text-2xl font-medium">Cancelled</span> 
                </div>
                <div className='flex items-center mb-4'> 
                  <div className='w-4 h-4 bg-radial-2 rounded-lg mr-4'></div> 
                  <span className="text-2xl font-medium">Delivered</span> 
                </div>
                <div className='flex items-center mb-4'> 
                  <div className='w-4 h-4 bg-radial-3 rounded-lg mr-4'></div> 
                  <span className="text-2xl font-medium">Pending</span> 
                </div>
              </div>
            </div>
            
          </div>
          <div className="flex flex-col rounded-2xl recent h-auto shadow-2xl">
            <p className="text-2xl ml-4 mt-2 mb-0 font-medium">
              Sales overview
            </p>
            {salesData.length > 0 ? <AreaChart data={salesData} /> : <p>No sales data available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
