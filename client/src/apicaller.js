import axios from 'axios';

const getToken = () => {
    let token = localStorage.getItem("userDetails") || null;
    const parsedToken = JSON.parse(token) || "";
    token = token ? `Bearer ${parsedToken.token}` : ""
    return token;
}


const axiosInstance = axios.create({
  baseURL: 'https://garage-management-system-backend.onrender.com', // Replace with your API base URL
});


export const loginUser = (userDetails) => {
    return axiosInstance.post("/user/login", userDetails)
}

export const getAllVehicles = async() => {
    axiosInstance.defaults.headers.common['Authorization'] = getToken();
    try {
        return await axiosInstance.get("/vehicle/all")
    } catch (error) {
        throw error
    }
}

export const addVehicle = (newVehicleDetails) => {
    return axiosInstance.post("/vehicle/create", newVehicleDetails)
}

export const getVehicleBrands = async() => {
    axiosInstance.defaults.headers.common['Authorization'] = getToken();
    try {
        return await axiosInstance.get("/brand/all")
    } catch (error) {
        throw error
    }
}

export const getVehicleModels = async() => {
    axiosInstance.defaults.headers.common['Authorization'] = getToken();
    try {
        return await axiosInstance.get(`/model/all`)
    } catch (error) {
        throw error
    }
}

export const getVehicleJobCardDetails = async(vehicleNumber) => {
    axiosInstance.defaults.headers.common['Authorization'] = getToken();
    try {
        return await axiosInstance.get(`/vehicle/${vehicleNumber}`)
    } catch (error) {
        throw error
    }
}

export const createJobCard = async(newJobCardDetails) => {
    axiosInstance.defaults.headers.common["Authorization"] = getToken();
    try {
        return await axiosInstance.post("/job/create", newJobCardDetails)
    } catch (error) {
        throw error
    }
}


// import fetch from 'isomorphic-fetch';

// const baseURL = 'https://garage-management-system-backend.onrender.com'

// let token = localStorage.getItem("userDetails") || null;
// console.log("token zero", token)
// const parsedToken = JSON.parse(token) || "";
// console.log("parsedToken", parsedToken);
// token = token ? `Bearer ${parsedToken.token}` : ""

// const fetchApi = (url, options = {}) => {
//     options.headers = {
//         ...options.headers,
//         'Authorization': token
//     };
//     // For cookie store
//     options = Object.assign(options, {
//         credentials: 'same-origin'
//     });
//     console.log("options", options)
//     return new Promise((resolve, reject) => {
//         fetch(`${baseURL}${url}`, options)
//             .then(res => {
//                 if (res.status >= 200 && res.status < 300) {
//                     return resolve(res.json());
//                 }
//                 else {
//                     return res.json()
//                         .then(json => {
//                             json.status = res.status;
//                             return reject(json);
//                         })
//                         .catch(err => {
//                             err.status = res.status;
//                             return reject(err);
//                         });
//                 }
//             })
//     });
// }

// export const getAllVehicles = async () => {
//     try {
//         return await fetchApi("/vehicle/all-vehicles", { method: "GET" })
//     } catch (error) {
//         throw error
//     }
// }

// export const addVehicle = (newVehicleDetails) => {
//     return fetchApi("/vehicle/create", { body: JSON.stringify(newVehicleDetails), method: "POST" })
// }

// export const loginUser = (userDetails) => {
//     return fetchApi("/user/login", { body: JSON.stringify(userDetails), method: "POST" })
// }