import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CustomText from '../components/CustomText';
import { faPeopleGroup, faUserTie, faUserGroup, faCirclePlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SideMenu from '../components/SideMenu';
import PopUp from '../components/PopUp';
import avatar from '../assets/employees/avatar.png';
import { useGetEmployeesQuery, useDeleteEmployeeMutation, useCreateEmployeeMutation, useUpdateEmployeeMutation, useUploadProfileImageMutation } from '../slices/employeeApiSlice';
import Spinner from '../components/Spinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dropdown from '../components/Dropdown';

const Employees = () => {
  const [popup, setPopUp] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [addPopup, setAddPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [image, setimage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [search, setSearch] = useState('');

  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const { data: employeesData, refetch, isLoading } = useGetEmployeesQuery();
  const [deleteEmployee, { isLoading: loadingDelete }] = useDeleteEmployeeMutation();
  const [createEmployee, { isLoading: loadingCreate }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: loadingUpdate }] = useUpdateEmployeeMutation();
  const [uploadProfileImage, { isLoading: loadingUpload }] = useUploadProfileImageMutation();
  const [designationFilter, setDesignationFilter] = useState('');

  useEffect(() => {
    if (employeesData) {
      setEmployees(employeesData);
    }
  }, [employeesData]);

  useEffect(() => {
    if (selectedEmployee) {
      setName(selectedEmployee.name);
      setDesignation(selectedEmployee.designation);
      setAddress(selectedEmployee.address);
      setPhone(selectedEmployee.phone);
      setStatus(selectedEmployee.status);
      setimage(selectedEmployee.image);
    }
  }, [selectedEmployee]);

  const activeEmployees = employees.filter((employee) => employee.status === 'Active').length;
  const leaveEmployees = employees.filter((employee) => employee.status === 'On leave').length;
  const newEmployees = employees.filter((employee) => employee.status === 'New').length;
  const totalEmployees = employees.length;

  const handleDelete = async () => {
    try {
      await deleteEmployee(selectedEmployee._id);
      setDeletePopup(false);
      refetch();
      toast.success('Employee removed successfully');
      resetForm();
    } catch (err) {
      console.log('Error response:', err.response);
      toast.error(err.message);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await uploadProfileImage(formData).unwrap();
      console.log(res);
      setimage(res.image);
      setImagePreview(URL.createObjectURL(file));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError('Profile image is required');
      return;
    }

    const existingEmployee = employees.find((employee) => employee.name.toLowerCase() === name.toLowerCase());

    if (existingEmployee) {
      setError('Employee name already exists');
      return;
    }

    const newEmployee = {
      image,
      name,
      designation,
      address,
      phone,
      status: 'New',
    };

    try {
      await createEmployee(newEmployee);
      setAddPopup(false);
      refetch();
      resetForm();
      toast.success('Employee added successfully');
    } catch (err) {
      console.log('Error response:', err.response);
      toast.error(err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!image) {
      setError('Profile image is required');
      return;
    }

    try {
      if (!selectedEmployee._id) {
        console.log('Please select an employee');
        return;
      }

      await updateEmployee({
        id: selectedEmployee._id,
        name,
        designation,
        address,
        phone,
        image,
        status,
      });
      setEditPopup(false);
      refetch();
      toast.success('Employee updated successfully');
      resetForm();
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const resetForm = () => {
    setSelectedEmployee(null);
    setName('');
    setDesignation('');
    setAddress('');
    setPhone('');
    setimage(null);
    setStatus('');
    setImagePreview(null);
    setError('');
  };

  return (
    <div>
      <ToastContainer />
      <Header title="Employees" />
      <SideMenu />
      <div className="p-4 sm:ml-64">
        <CustomText title="Manage Employees" fontSize="25px" fontWeight="600" />
        <div className="grid grid-cols-2 gap-4 w-full mt-8 px-32">
          <div className="col bg-t-employee shadow-lg rounded-3xl h-auto p-8">
            <div className="flex flex-row justify-between">
              <div className="col-span-2">
                <CustomText title="Total Employees" fontSize="22px" fontWeight="600" />
                <CustomText title={`${totalEmployees}`} fontSize="32px" fontWeight="500" />
              </div>
              <div className="circle-icon bg-t-circle flex items-center justify-center w-20 h-20 rounded-full">
                <FontAwesomeIcon icon={faPeopleGroup} className="w-16 h-16 " />
              </div>
            </div>
          </div>
          <div className="col bg-on-employee shadow-lg rounded-3xl h-auto p-8">
            <div className="flex flex-row justify-between">
              <div className="col-span-2">
                <CustomText title="On leave Employees" fontSize="22px" fontWeight="600" />
                <CustomText title={`${leaveEmployees}`} fontSize="32px" fontWeight="500" />
              </div>
              <div className="circle-icon bg-on-circle flex items-center justify-center w-20 h-20 rounded-full">
                <FontAwesomeIcon icon={faClock} className="w-14 h-14 " />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mt-8 px-32">
          <div className="col bg-a-employee shadow-lg rounded-3xl h-auto p-8">
            <div className="flex flex-row justify-between">
              <div className="col-span-2">
                <CustomText title="Active Employees" fontSize="22px" fontWeight="600" />
                <CustomText title={`${activeEmployees}`} fontSize="32px" fontWeight="500" />
              </div>
              <div className="circle-icon bg-a-circle flex items-center justify-center w-20 h-20 rounded-full">
                <FontAwesomeIcon icon={faUserTie} className="w-12 h-12 " />
              </div>
            </div>
          </div>
          <div className="col bg-n-employee shadow-lg rounded-3xl h-auto p-8">
            <div className="flex flex-row justify-between">
              <div className="col-span-2">
                <CustomText title="New Joined Employees" fontSize="22px" fontWeight="600" />
                <CustomText title={`${newEmployees}`} fontSize="32px" fontWeight="500" />
              </div>
              <div className="circle-icon bg-n-circle flex items-center justify-center w-20 h-20 rounded-full">
                <FontAwesomeIcon icon={faUserGroup} className="w-12 h-12 " />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between mt-20 ml-2 mr-2 w-full">
          <div className='w-1/3'>
          <div className="total w-56 mb-1.5 h-12 rounded-xl shadow-xl flex space-around items-center cursor-pointer ml-16">
            <div className="flex flex-row" onClick={() => setAddPopup(true)}>
              <FontAwesomeIcon icon={faCirclePlus} className="w-8 h-8 text-supply-green ml-4 mr-5" />
              <h5 className="mt-1">Add Employee</h5>
            </div>
          </div>
          </div>

          <Dropdown
            options={['Head Chef', 'Sous Chef', 'Pastry Chef', 'Restaurant Manager', 'Bartender', 'Host', 'Hostess','Dishwasher', 'Line Cook', 'Waiter', 'Waitress']}
            value={designationFilter}
            onChange={(e) => setDesignationFilter(e.target.value)}
            width="w-1/2"
            darkColor="bg-gray-700"
            darkTextColor="text-white"
            />

          

          <input
            type="text"
            id="first_name"
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-50 mb-1.5 text-gray-900 text-lg rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-52 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-16"
            placeholder="Search"
            required
          />
   
        </div>

        <div className="relative overflow-x-auto shadow-lg sm:rounded-2xl mt-8 mx-16">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xl text-gray-700 bg-table-head dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Designation</th>
                <th scope="col" className="px-6 py-3 text-center">Address</th>
                <th scope="col" className="px-6 py-3">Phone</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
            {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center flex justify-center">
                    <Spinner />
                  </td>
                </tr>
              ) : (
                <>
                  {employeesData
                    ?.filter((employee) => {
                      const searchLower = search.toLowerCase();
                      const matchesSearch = searchLower === '' ? true : employee?.name.toLowerCase().includes(searchLower);
                      const matchesDesignation = designationFilter === '' ? true : employee?.designation === designationFilter;
                      return matchesSearch && matchesDesignation;
                    })
                    .length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-xl text-gray-700">
                        Employee not found
                      </td>
                    </tr>
                  ) : (
                    employeesData
                      ?.filter((employee) => {
                        const searchLower = search.toLowerCase();
                        const matchesSearch = searchLower === '' ? true : employee?.name.toLowerCase().includes(searchLower);
                        const matchesDesignation = designationFilter === '' ? true : employee?.designation === designationFilter;
                        return matchesSearch && matchesDesignation;
                      })
                      .map((employee, index) => (
                        <tr
                          key={index}
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setPopUp(true);
                          }}
                          className="odd:bg-table-row odd:dark:bg-gray-900 even:bg-table-head even:dark:bg-gray-800 border-b dark:border-gray-700 text-black text-lg font-medium cursor-pointer"
                        >
                          <th scope="row" className="px-6 py-4 font-medium text-lg text-black whitespace-nowrap dark:text-white">
                            <div className="flex -flex-row items-center dark:text-white">
                              <img src={employee.image} className="w-14 h-14 mr-4 rounded-full " alt="profile" />
                              {employee.name}
                            </div>
                          </th>
                          <td className="px-6 py-4 dark:text-white">{employee?.designation}</td>
                          <td className="px-6 py-4 dark:text-white">{employee?.address}</td>
                          <td className="px-6 py-4 dark:text-white">{employee?.phone}</td>
                          <td className="px-6 py-4 dark:text-gray-50">
                            {employee?.status === 'Active' && <div className="p-2 bg-a-circle rounded-lg text-center">Active</div>}
                            {employee?.status === 'On leave' && <div className="p-2 bg-on-circle rounded-lg text-center">Leave</div>}
                            {employee?.status === 'New' && <div className="p-2 bg-n-circle rounded-lg text-center">New</div>}
                          </td>
                        </tr>
                      ))
                  )}
                </>
              )}
            </tbody>
          </table>

          {/* edit employee */}
          <PopUp trigger={editPopup} setTrigger={setEditPopup} width="w-1/3">
            <FontAwesomeIcon icon={faXmark} className="cursor-pointer" onClick={() => setEditPopup(false)} />
            <h3 className="text-center mb-8">Edit employee</h3>
            {selectedEmployee ? (
              <form onSubmit={handleUpdate} className="max-w-sm mx-auto">
                <div className="mb-3">
                  <label htmlFor="name" className="block mb-2 text-lg font-medium text-gray-900">Employee Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="John Steve"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <Dropdown
                  label="Designation"
                  options={['Head Chef', 'Sous Chef', 'Pastry Chef', 'Restaurant Manager', 'Bartender', 'Host', 'Hostess','Dishwasher', 'Line Cook', 'Waiter', 'Waitress']}
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  width="w-[360px]"
                  fontSize="text-sm"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="block mb-2 text-lg font-medium text-gray-900">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="123 Main St, Springfield, USA"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="block mb-2 text-lg font-medium text-gray-900">Phone number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="+1 555-123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                <label htmlFor="image" className="block mb-2 text-lg font-medium text-gray-900">Photo Url</label>
                <label htmlFor="image" className="block cursor-pointer">
                  <img src={imagePreview || image} className="w-20 h-20 rounded-full mb-2" alt="avatar" />
                  <input
                    type="file"
                    id="image"
                    name="image"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    style={{ position: 'absolute', left: '-9999px' }}
                    onChange={handleImageChange}
                    
                  />
                </label>
              </div>

                <div className="mb-5">
                  <label htmlFor="status" className="block mb-2 text-lg font-medium text-gray-900">Status</label>
                  <select
                    id="status"
                    name="status"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option className="text-gray-500">Select Status</option>
                    <option>Active</option>
                    <option>On leave</option>
                  </select>
                </div>

                <div className="mb-3 flex justify-around">
                  <button type="submit" className="w-full bg-black text-white font-medium text-lg rounded-lg py-2.5 mr-4">Update Employee</button>
                </div>
              </form>
            ) : null}
          </PopUp>

          {/* add new employee */}
          <PopUp trigger={addPopup} setTrigger={setAddPopup} width="w-1/3">
            <FontAwesomeIcon icon={faXmark} className="cursor-pointer" onClick={() => setAddPopup(false)} />
            <h3 className="text-center mb-8">Add employee</h3>
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
              <div className="mb-3">
                <label htmlFor="name" className="block mb-2 text-lg font-medium text-gray-900">Employee Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="John Steve"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
              <div className="mb-3">
              <Dropdown
              label="Designation"
              options={['Head Chef', 'Sous Chef', 'Pastry Chef', 'Restaurant Manager', 'Bartender', 'Host', 'Hostess','Dishwasher', 'Line Cook', 'Waiter', 'Waitress']}
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              width="w-[360px]"
              fontSize="text-sm"
              />
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="block mb-2 text-lg font-medium text-gray-900">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="123 Main St, Springfield, USA"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="block mb-2 text-lg font-medium text-gray-900">Phone number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="+1 555-123-4567"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="image" className="block mb-2 text-lg font-medium text-gray-900">Photo Url</label>
                <label htmlFor="image" className="block cursor-pointer">
                  <img src={imagePreview || avatar} className="w-20 h-20 rounded-full mb-2" alt="avatar" />
                  <input
                    type="file"
                    id="image"
                    name="image"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    style={{ position: 'absolute', left: '-9999px' }}
                    onChange={handleImageChange}
                    required
                  />
                </label>
              </div>

              <button type="submit" className="w-full bg-black text-white font-medium text-lg rounded-lg py-2.5 mr-4">Add Employee</button>
            </form>
          </PopUp>

          {/* delete employee */}
          <PopUp trigger={deletePopup} setTrigger={setDeletePopup}>
            <div className="text-center">
              <p className="text-xl">Are you sure you want to delete this employee?</p>
              <div className="flex justify-around mt-8">
                <button onClick={handleDelete} className="w-1/2 bg-black text-white font-medium text-lg rounded-2xl py-2.5 mr-4">Delete</button>
                <button onClick={() => setDeletePopup(false)} className="w-1/2 bg-gray-500 text-white font-medium text-lg rounded-2xl py-2.5">Cancel</button>
              </div>
            </div>
          </PopUp>

          {/* select delete or update employee */}
          <PopUp trigger={popup} setTrigger={setPopUp} width="w-2/5">
            <FontAwesomeIcon icon={faXmark} className="cursor-pointer" onClick={() => setPopUp(false)} />
            <h3 className="text-center mb-8">Select your preference</h3>
            <div className="text-center">
              <div className="flex justify-center mt-8">
                <button onClick={() => { setDeletePopup(true); setPopUp(false); }} className="w-1/2 bg-black text-white font-medium text-xl rounded-2xl p-2.5 mr-4">Delete</button>
                <button onClick={() => { setEditPopup(true); setPopUp(false); }} className="w-1/2 bg-gray-200 text-gray-900 font-medium text-lg rounded-2xl p-2.5">Update</button>
              </div>
            </div>
          </PopUp>
        </div>
      </div>
    </div>
  );
};

export default Employees;
