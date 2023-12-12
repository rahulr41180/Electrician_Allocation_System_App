
import "../CSS/RawSitesTableComponents.css"

import { useState, useEffect } from "react";
import { Checkbox, Pagination, DatePicker } from "antd";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";

export const RawSitesTableComponent = () => {

    const [rawSitesData, setRawSitesData] = useState([]);
    // console.log('rawSitesData:', rawSitesData)

    const [currentPage, setCurrentPage] = useState(1);
    const [rawSitesPerPage, setRawSitesPerPage] = useState(10)
    const [totalRawSites, setTotalRawSites] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    // console.log('totalRawSites:', totalRawSites)

    useEffect(() => {
        getTotalRawSitesCount();
    }, [])

    // Function for getting total raw sites count
    const getTotalRawSitesCount = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get("http://localhost:8080/api/v1/raw-site/get-raw-sites-count");
            // console.log('data-product:', data)
            if (data.status) {
                // setTotalPages(Math.ceil(data.totalProduct) / 2);
                setTotalRawSites(data.totalRawSites);

            }
            setIsLoading(false);

        } catch (error) {
            toast.error("Something went wrong please try again later")
        }
    }

    useEffect(() => {
        getAllRawSitesDataFn();
    }, [currentPage])


    // Function to getting raw sites data with pagination
    const getAllRawSitesDataFn = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8080/api/v1/raw-site/get-all-rawsitedata/${currentPage}/${rawSitesPerPage}`)
            console.log('data:', data)
            if (data) {

                setRawSitesData(data.rawSites);
            }
        } catch (error) {
            toast.error("Something went wrong please try again later")
        }
    }

    // Function to updating raw site installation date
    const handleDateChange = async (date, dateString, pId) => {

        // console.log('dateString:', dateString)
        // console.log('date:', date)
        // console.log('pId:', pId)
        try {
            if (dateString) {
                setIsLoading(true);
                const { data } = await axios.put(`http://localhost:8080/api/v1/raw-site/update-installation-date-of-raw-site/${pId}`, {
                    installationDate: dateString
                })

                // console.log('data:', data)
                if (data.status) {
                    getAllRawSitesDataFn()
                    toast.success(data.message);
                } else {
                    toast.error(data.message)
                }
                setIsLoading(false);
            } else {

                toast.error("Please select proper date")
            }
        } catch (error) {
            console.log(error.message)
        }
    };

    // Function to quick update raw site with electrician 
    const handleQuickUpdateSites = async () => {

        try {
            setIsLoading(true);
            const { data } = await axios.get("http://localhost:8080/api/v1/raw-site/quick-update-all-raw-sites");
            // console.log('data:', data)
            if (data.status) {
                getAllRawSitesDataFn();
                toast.success(data.message);
            } else {
                toast.error(data.message)

            }
            setIsLoading(false);
        } catch (error) {
            alert("Error in quick update");
        }
    }

    // Function to quick update pending electrician to raw sites
    const handleQuickUpdatePendingElectrician = async () => {

        try {
            setIsLoading(true);
            const { data } = await axios.get("http://localhost:8080/api/v1/raw-site/quick-update-all-pending-raw-sites");
            // console.log('data:', data)
            if (data.status) {
                getAllRawSitesDataFn();
                toast.success(data.message)
            } else {
                toast.error(data.message)

            }
            setIsLoading(false);
        } catch (error) {
            alert("Error in quick pending update");
        }
    }

    // Function to update raw site based on grievance profile of electrician
    const handleGrievanceBasedAssign = async (pId) => {

        try {
            setIsLoading(true);
            const { data } = await axios.get(`http://localhost:8080/api/v1/raw-site/single-raw-site-update/${pId}`);
            // console.log('data:', data)
            if (data.status) {
                getAllRawSitesDataFn();
                toast.success(data.message);
            } else {
                toast.error(data.message)

            }
            setIsLoading(false);
        } catch (error) {
            alert("Error in grievance based update");
        }
    }

    // Function to update raw site with random electrician
    const handleRandomAssign = async (pId) => {

        try {
            setIsLoading(true);
            const { data } = await axios.get(`http://localhost:8080/api/v1/raw-site/single-raw-site-update-with-any-electrician/${pId}`);
            // console.log('data:', data)
            if (data.status) {
                getAllRawSitesDataFn();
                toast.success(data.message);
            } else {
                toast.error(data.message)

            }
            setIsLoading(false);
        } catch (error) {
            alert("Error in random assigned update");
        }
    }

    return (
        <>

            <div id="feacture_box" className="d-flex justify-content-center mt-5 p-2 ms-auto me-auto gap-2 flex-wrap align-content-center">
                <button className="btn btn-primary" onClick={handleQuickUpdateSites}>Quick Update Sites</button>
                <button className="btn btn-secondary" onClick={handleQuickUpdatePendingElectrician}>Quick Update Pending Electrician</button>
            </div>

            <div id="rawSitesTable_box" className="mt-5 p-3 ms-auto me-auto text-center">
                <table className="table table-bordered align-middle">
                    <thead>
                        <tr>

                            <th scope="col">Name</th>
                            <th scope="col">Phone</th>
                            <th scope="col">City</th>
                            <th scope="col">
                                <tr className="d-flex justify-content-center">
                                    <th scope="col" className="">Assigned Electrician</th>
                                </tr>
                                <tr className="d-flex justify-content-center gap-3">
                                    <th scope="col">Name</th>

                                    <th scope="col">Assigned Date</th>
                                </tr>
                            </th>
                            <th scope="col">Installation Date</th>
                            <th scope="col">Grievance</th>
                            <th scope="col">Do Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {rawSitesData?.map((element, index) => {
                            return (
                                <>
                                    <tr key={index}>
                                        <td>{element.name}</td>
                                        <td>{element.phone}</td>
                                        <td>{element.city}</td>
                                        <td>
                                            {element?.assignedElectritian?.map((item, index) => {
                                                
                                                return (
                                                    <>
                                                        <tr key={index} className="d-flex justify-content-center gap-3">
                                                            <td>{item.name}</td>
                                                            <td>
                                                                {item?.assignedSites?.map((i, index) => {
                                                                    if (i._id === element._id && i.electricianAssignDate) {
                                                                        const formattedDate = new Date(i.electricianAssignDate).toISOString().split("T")[0];
                                                                        return formattedDate

                                                                    }
                                                                    return null
                                                                })}
                                                            </td>
                                                        </tr>
                                                    </>
                                                )
                                            })}
                                        </td>

                                        <td className="d-flex flex-column gap-2">
                                            <span>{element.installationDate}</span>
                                            <DatePicker onChange={(date, dateString) => {
                                                handleDateChange(date, dateString, element._id)
                                            }} dateFormat="yyyy/MM/dd" utcOffset={0} />
                                        </td>
                                        <td>{element.grievance ? "true" : "false"}</td>
                                        <td className="d-flex flex-column gap-2">
                                            <button className="btn btn-primary" onClick={() => {

                                                handleGrievanceBasedAssign(element._id);
                                            }}>Grievance Based Assign</button>
                                            <button className="btn btn-secondary" onClick={() => {
                                                handleRandomAssign(element._id);
                                            }}>Random Assign</button>
                                        </td>
                                    </tr>
                                </>
                            )

                        })}
                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-center mt-4">
                <Pagination showSizeChanger={false} defaultCurrent={1} total={totalRawSites} pageSize={rawSitesPerPage} onChange={(page, pageSize) => {
                    console.log('page:', page, "pageSize :", pageSize)
                    setCurrentPage(page);
                    setRawSitesPerPage(pageSize);

                }} />
            </div>
            <Toaster />
            <div id={isLoading ? "model_Visible" : "model_hidden"}>
                <div id="spinner_box">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="spinner-border text-secondary" role="status">

                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>

                    <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </>
    )
}