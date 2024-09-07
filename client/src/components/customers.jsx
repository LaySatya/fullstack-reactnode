import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
function Customer() {
    const [customers , setCustomers] = useState([]);
    const [toggle, setToggle] = useState(false);
    const [toggleUpdateModal , setToggleUpdateModal] = useState(false);
    const [toggleDeleteModal , setToggleDeleteModal] = useState(false);
    const [selectedId , setSelectedId] = useState(null);
    const [formCustomers , setFormCustomers] = useState({
      firstname: '',
      lastname: '',
      gender: '',
      tel: '',
      email: '',
    });
    const handleModalUpdatePopUp = (id) => {
      setSelectedId(id);
      setToggleUpdateModal(true);
      // setFormCustomers({...formCustomers , id});
      getCustomersById(id);
      console.log(formCustomers);
    }
    const handleUpdateModalCloseCustomer = () => {
      setToggleUpdateModal(false);
    }
    const getCustomersById = (id) => {
      axios.get(`http://localhost:8080/api/customer/${id}`)
       .then((response) => {
          setFormCustomers(response.data.list[0]);
          // console.log(response.data.list[0]);

        })
       .catch((error) => {
          console.error(error);
        });
    }
    const handleUpdateCustomer = (id) => {
      // console.log(formCustomers)
      axios.put(`http://localhost:8080/api/customer/`, formCustomers , id)
       .then((response) => {
          toast.success(response.data.message);
          rederingCustomers();
          resetForm();
          handleUpdateModalCloseCustomer();
        })
       .catch((error) => {
          console.error(error);
        });
    }
    const handleModalDeletePopUp = (id) => {
      setToggleDeleteModal(true);
      setSelectedId(id);
    }
    const handleCLoseDeleteModalPopUp = () => {
      setToggleDeleteModal(false);
    }
    const handleModalAddCustomer = () =>{
      setToggle(true);
    }
    const handleModalCloseCustomer = () => {
      setToggle(false);
    }
    //  reset form values
    const resetForm = () => {
      setFormCustomers({
        firstname: '',
        lastname: '',
        gender: '',
        tel: '',
        email: '',
      });
    };
    // validate the customers input form 
    const validateForm = () => {
      const newErrors = {};
      Object.keys(formCustomers).forEach((key) => {
        if (!formCustomers[key]) {
          newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        }
      });
      return Object.keys(newErrors).length === 0;
    };
  
    // handle when user input in the customer field
    const handleCustomerInputForm = (e) => {
      const {name , value} = e.target;
      setFormCustomers({...formCustomers, [name]: value });
    }

    // handle add new customer to api
    const handleAddNewCustomer = (e) => {
      if (!validateForm()) {
        toast.error("All fields are required!");
        return;
      }
      e.preventDefault();
      axios.post('http://localhost:8080/api/customer/', formCustomers).then(response => {
        if(response.data.message){
          rederingCustomers();
          toast.success(response.data.message);
          setToggle(false);
          resetForm();
        }
      }).catch(error => {
        console.error(error);
      })
    }
    useEffect(() => {
        rederingCustomers();
    }, []);
    
    // redering all customers from api
    const rederingCustomers = async () => {
        axios.get('http://localhost:8080/api/customers').then(response => {
            setCustomers(response.data.list);
        }).catch(error => {
            console.error(error);
        })
    }

    // handle to delete customer by id from api
    const handleDeleteCustomer = (id) => {
      if(id !== '' || id !== null){
        axios.delete(`http://localhost:8080/api/customer/${id}`).then(response => {
          if(response.data.message){
            rederingCustomers();
            toast.success(response.data.message);
            setToggleDeleteModal(false);
          }
          
        }).catch(error => {
          console.error(error);
        })
      }
      else{
        toast.error("Invalid customer ID");
      }
    }

    // const [search , setSearch] = useState({
    //   search: ''
    // });
    // const handleSearchInputForm = (e) => {
    //   const {name, value} = e.target;
    //   setSearch({...search, [name]: value });
    //   axios.get(`http://localhost:8080/api/searchCustomers`, search)
    //    .then((response) => {
    //       // setCustomers(response.data.list);
    //       console.log(response.data.list);
    //     })
    //    .catch((error) => {
    //       console.error(error);
    //     });
    // }
    
    // const handleSearch = () =>{
    // }

  return (
    <>
      <Toaster />
      <div>
          <div className='w-[74%] mx-auto'>
          <div className="flex justify-end mt-12">
            <button className="p-2 bg-blue-500 rounded-md text-white border border-sm px-3 hover:opacity-75" onClick={handleModalAddCustomer}>Add new</button>
          </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-8">
              <div className="flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
                <div>
                  <button 
                    id="dropdownRadioButton" 
                    data-dropdown-toggle="dropdownRadio" 
                    className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" 
                    type="button"
                  >
                    <svg 
                      className="w-3 h-3 text-gray-500 dark:text-gray-400 me-3" 
                      aria-hidden="true" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                    </svg>
                    Last 30 days
                    <svg 
                      className="w-2.5 h-2.5 ms-2.5" 
                      aria-hidden="true" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 10 6"
                    >
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                  </button>
                  {/* Dropdown menu */}
                  <div 
                    id="dropdownRadio" 
                    className="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                  >
                    <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownRadioButton">
                      <li>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input 
                            id="filter-radio-example-1" 
                            type="radio" 
                            value="" 
                            name="filter-radio" 
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label htmlFor="filter-radio-example-1" className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Last day</label>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input 
                             
                            id="filter-radio-example-2" 
                            type="radio" 
                            value="" 
                            name="filter-radio" 
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label htmlFor="filter-radio-example-2" className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Last 7 days</label>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input 
                            id="filter-radio-example-3" 
                            type="radio" 
                            value="" 
                            name="filter-radio" 
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label htmlFor="filter-radio-example-3" className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Last 30 days</label>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input 
                            id="filter-radio-example-4" 
                            type="radio" 
                            value="" 
                            name="filter-radio" 
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label htmlFor="filter-radio-example-4" className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Last month</label>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input 
                            id="filter-radio-example-5" 
                            type="radio" 
                            value="" 
                            name="filter-radio" 
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label htmlFor="filter-radio-example-5" className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Last year</label>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <label htmlFor="table-search" className="sr-only">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                    <svg 
                      className="w-5 h-5 text-gray-500 dark:text-gray-400" 
                      aria-hidden="true" 
                      fill="currentColor" 
                      viewBox="0 0 20 20" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    id="table-search"
                    name="search" 
                    // onChange={(e)=>handleSearchInputForm(e)}
                    className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="Search for items"
                  />
                </div>
              </div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="p-4">
                      <div className="flex items-center">
                        <input 
                          id="checkbox-all-search" 
                          type="checkbox" 
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">No</th>
                    <th scope="col" className="px-6 py-3">Fistname</th>
                    <th scope="col" className="px-6 py-3">Lastname</th>
                    <th scope="col" className="px-6 py-3">Gender</th>
                    <th scope="col" className="px-6 py-3">Tel</th>
                    <th scope="col" className="px-6 py-3">Email</th>
                    <th scope="col" className="px-6 py-3">Create at</th>
                    <th scope="col" className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                      {
                        customers.length > 0 ? (
                          customers.map((c) => (
                            <tr key={c.customer_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <input 
                                            
                                            type="checkbox" 
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                            <label className="sr-only">checkbox</label>
                                        </div>
                                        </td>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                          {c.customer_id}
                                        </th>
                                        <td className="px-6 py-4">{c.firstname}</td>
                                        <td className="px-6 py-4">{c.lastname}</td>
                                        <td className="px-6 py-4">
                                          {
                                            c.gender === 1 ? 'Male' : 'Female'
                                          }
                                        </td>
                                        <td className="px-6 py-4">{c.tel}</td>
                                        <td className="px-6 py-4">{c.email}</td>
                                        <td className="px-6 py-4">{c.create_at}</td>
                                        <td className="px-6 py-4">
                                          <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={()=>handleModalUpdatePopUp(c.customer_id)}>Edit</button>
                                          <button type="button" className="font-medium text-red-600 dark:text-red-500 hover:underline px-2" onClick={()=>handleModalDeletePopUp(c.customer_id)}>Delete</button>
                                        </td>
                                                
                                    </tr>
                                    
                          ))
                        ) : 
                        (
                          <tr>
                            <td colSpan="9" className="px-6 py-2 text-center text-[16px]">No data found!</td>
                          </tr>
                        )
                      }
                </tbody>
              </table>
            </div>
        </div>
      </div>

          {/* Modal pop up add customers */}

          <div className={`${toggle ? 'block' : 'hidden'} relative z-10 ease-out duration-300`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      
              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 md:w-[33rem] w-full">
                  <form>
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:items-start">
                          <div className="flex">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                              <h3 className="text-base font-semibold leading-6 text-gray-900 m-1.5" id="modal-title">New Customer</h3>
                            </div>
                          </div>
                              <div className="w-full">
                                    <div className="mt-3">
                                      <label htmlFor="firstname" className="block text-sm font-medium text-muted mb-1">First Name</label>
                                      <input
                                        onChange={(e)=>handleCustomerInputForm(e)}
                                        value={formCustomers.firstname}
                                        type="text"
                                        id="firstname"
                                        name="firstname"
                                        placeholder="Enter your first name"
                                        className="input-field border border-muted rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent w-full"
                                      />
                                    </div>
                                    <div className="mt-3">
                                      <label htmlFor="lastname" className="block text-sm font-medium text-muted mb-1">Last Name</label>
                                      <input
                                        onChange={(e)=>handleCustomerInputForm(e)}
                                        value={formCustomers.lastname}
                                        type="text"
                                        id="lastname"
                                        name="lastname"
                                        placeholder="Enter your last name"
                                        className="input-field border border-muted rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent w-full"
                                      />
                                    </div>
                                    <div className="mt-3">
                                      <label htmlFor="gender" className="block text-sm font-medium text-muted mb-1">Gender</label>
                                      <select id="gender" value={formCustomers.gender} onChange={(e)=>handleCustomerInputForm(e)} name="gender" className="input-field border border-muted rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent w-full">
                                        <option selected>Select gender</option>
                                        <option value="1">Male</option>
                                        <option value="0">Female</option>
                                      </select>
                                    </div>
                                    <div className="mt-3">
                                      <label htmlFor="tel" className="block text-sm font-medium text-muted mb-1">Telephone</label>
                                      <input
                                        onChange={(e)=>handleCustomerInputForm(e)}
                                        value={formCustomers.tel}
                                        type="tel"
                                        id="tel"
                                        name="tel"
                                        placeholder="Enter your telephone number"
                                        className="input-field border border-muted rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent w-full"
                                      />
                                    </div>
                                    <div className="mt-3">
                                      <label htmlFor="email" className="block text-sm font-medium text-muted mb-1">Email</label>
                                      <input
                                        onChange={(e)=>handleCustomerInputForm(e)}
                                        value={formCustomers.email}
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        className="input-field border border-muted rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent w-full"
                                      />
                                    </div>
                          </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button onClick={handleAddNewCustomer} type="button" className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 px-3 sm:ml-3 sm:w-auto">Add</button>
                      <button onClick={handleModalCloseCustomer} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Close</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>


          {/* Modal pop up add customers */}

          <div className={`${toggleUpdateModal ? 'block' : 'hidden'} relative z-10 ease-out duration-300`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" aria-hidden="true"></div>
      
              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 md:w-[33rem] w-full">
                  <form>
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:items-start">
                          <div className="flex">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                              <h3 className="text-base font-semibold leading-6 text-gray-900 m-1.5" id="modal-title">Edit Customer</h3>
                            </div>
                          </div>
                              <div className="w-full">
                                    <div className="mt-3">
                                      <label htmlFor="firstname" className="block text-sm font-medium text-muted mb-1">First Name</label>
                                      <input
                                        onChange={(e)=>handleCustomerInputForm(e)}
                                        value={formCustomers.firstname}
                                        type="text"
                                        id="firstname"
                                        name="firstname"
                                        placeholder="Enter your first name"
                                        className="input-field border border-muted rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent w-full"
                                      />
                                    </div>
                                    <div className="mt-3">
                                      <label htmlFor="lastname" className="block text-sm font-medium text-muted mb-1">Last Name</label>
                                      <input
                                        onChange={(e)=>handleCustomerInputForm(e)}
                                        value={formCustomers.lastname}
                                        type="text"
                                        id="lastname"
                                        name="lastname"
                                        placeholder="Enter your last name"
                                        className="input-field border border-muted rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent w-full"
                                      />
                                    </div>
                                    <div className="mt-3">
                                      <label htmlFor="gender" className="block text-sm font-medium text-muted mb-1">Gender</label>
                                      <select id="gender" value={formCustomers.gender} onChange={(e)=>handleCustomerInputForm(e)} name="gender" className="input-field border border-muted rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent w-full">
                                        <option selected>Select gender</option>
                                        <option value="1">Male</option>
                                        <option value="0">Female</option>
                                      </select>
                                    </div>
                                    <div className="mt-3">
                                      <label htmlFor="tel" className="block text-sm font-medium text-muted mb-1">Telephone</label>
                                      <input
                                        onChange={(e)=>handleCustomerInputForm(e)}
                                        value={formCustomers.tel}
                                        type="tel"
                                        id="tel"
                                        name="tel"
                                        placeholder="Enter your telephone number"
                                        className="input-field border border-muted rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent w-full"
                                      />
                                    </div>
                                    <div className="mt-3">
                                      <label htmlFor="email" className="block text-sm font-medium text-muted mb-1">Email</label>
                                      <input
                                        onChange={(e)=>handleCustomerInputForm(e)}
                                        value={formCustomers.email}
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        className="input-field border border-muted rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent w-full"
                                      />
                                    </div>
                          </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button onClick={()=>handleUpdateCustomer(selectedId)} type="button" className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 px-3 sm:ml-3 sm:w-auto">Update</button>
                      <button onClick={handleUpdateModalCloseCustomer} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Close</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
                      {/* Delete customer modal */}
          <div className={`${toggleDeleteModal ? 'block' : 'hidden'} relative z-10`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
                                        <div className="fixed inset-0 bg-opacity-50 bg-gray-400 transition-opacity" aria-hidden="true"></div>

                                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                                <div className="sm:flex sm:items-start">
                                                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                                    </svg>
                                                  </div>
                                                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                    <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Delete Customer</h3>
                                                    <div className="mt-2">
                                                      <p className="text-sm text-gray-500">Are you sure you want to delete this?</p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                <button onClick={()=>handleDeleteCustomer(selectedId)} type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Delete</button>
                                                <button onClick={handleCLoseDeleteModalPopUp} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                            </div>       
    </>
  )
}

export default Customer