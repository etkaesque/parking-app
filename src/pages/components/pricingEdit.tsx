import axios from "axios";
import { useState } from "react";
import { useRouter } from 'next/router';

type pricingWeekType = {
  fee: number;
  day: string;
  hours: string;
};

type pricingType = {
    data: {
      bus: pricingWeekType[];
      car: pricingWeekType[];
      motorcycle: pricingWeekType[];
    };
    toggle: () => void;
  };

type vehicleType = "car" | "bus" | "motorcycle";


export default function Pricing({ data, toggle }: pricingType) {
    const router = useRouter();
    const innitForm = () => {
        return {
            car: data.car.map((item) => ({ day: item.day, fee: item.fee })),
            motorcycle: data.motorcycle.map((item) => ({ day: item.day, fee: item.fee  })),
            bus: data.bus.map((item) => ({ day: item.day, fee: item.fee  })),
        };
    }


    const [formData, setFormData] = useState(innitForm());

    const handleChange = (event : any) => {

      
        const { name, value } = event.target;
        const [day, vehicle] = name.split("-") as [string, vehicleType]

        setFormData((prevFormData) => {
            const updatedFormData = {
              ...prevFormData,
              [vehicle]: prevFormData[vehicle].map((item) =>
                item.day === day ? { ...item, fee: Number(value) } : item
              ),
            };
            return updatedFormData;
          });
  

    }

    const submitNewPricing = async () => {

        try {
            await axios.put("http://13.49.77.37:8000/updatePricing", formData)

            router.reload();
        } catch (error) {
            console.log("Error while submiting a put request to server.", error)
        }

    }


    


    console.log("THIS IS FORM DATA HAHA", formData)



  let week = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (

      <div className="flex flex-col w-full items-center ">
      
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <div className="w-full flex gap-x-4 justify-end pr-6 mb-2">
                <button onClick={submitNewPricing} className="flex gap-2 items-center  hover:text-yellow-700 ">
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                        <path d="M12 16V22M12 16L14 18M12 16L10 18" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M22 13.3529C22 15.6958 20.5562 17.7055 18.5 18.5604M14.381 8.02721C14.9767 7.81911 15.6178 7.70588 16.2857 7.70588C16.9404 7.70588 17.5693 7.81468 18.1551 8.01498M7.11616 10.6089C6.8475 10.5567 6.56983 10.5294 6.28571 10.5294C3.91878 10.5294 2 12.4256 2 14.7647C2 16.6611 3.26124 18.2664 5 18.8061M7.11616 10.6089C6.88706 9.9978 6.7619 9.33687 6.7619 8.64706C6.7619 5.52827 9.32028 3 12.4762 3C15.4159 3 17.8371 5.19371 18.1551 8.01498M7.11616 10.6089C7.68059 10.7184 8.20528 10.9374 8.66667 11.2426M18.1551 8.01498C19.0446 8.31916 19.8345 8.83436 20.4633 9.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  <span>SAVE</span>
                </button>

                <button onClick={toggle} className="flex items-center gap-2 hover:text-yellow-700 ">
               
                    <svg width="28px" height="28px" viewBox="0 0 512 512" version="1.1" >
                        <title>cancel</title>
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="work-case" fill="#000000" transform="translate(91.520000, 91.520000)">
                                <polygon id="Close" points="328.96 30.2933333 298.666667 1.42108547e-14 164.48 134.4 30.2933333 1.42108547e-14 1.42108547e-14 30.2933333 134.4 164.48 1.42108547e-14 298.666667 30.2933333 328.96 164.48 194.56 298.666667 328.96 328.96 298.666667 194.56 164.48">

                    </polygon>
                            </g>
                        </g>
                    </svg>
                  <span>CANCEL</span>
                </button>


              </div>

              <table className="min-w-full text-center text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Days
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Car
                    </th>
                    <th scope="col" className="px-6 py-4">
                       Bus/Truck
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Motorcycle
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {week.map((day) => {

                    const carFee = formData.car.find((item) => item.day === day)?.fee
                    const busFee = formData.bus.find((item) => item.day === day)?.fee
                    const motorcycleFee = formData.motorcycle.find((item) => item.day === day)?.fee

                    return (
                      <tr className="border-b dark:border-neutral-500">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          {day}
                          <span className="block italic text-xs font-light"> {data.car.find((item) => item.day === day)?.hours}</span>
                         
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          <input onChange={handleChange} value={carFee} className="bg-slate-100 border border-indigo-600 p-1" type="number" name={day + '-car'} id={day + 'car'} />
                          
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                        <input onChange={handleChange}  value={busFee} className="bg-slate-100 border border-indigo-600 p-1" type="number" name={day + '-bus'} id={day + 'bus'} />
                  
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                        <input onChange={handleChange} value={motorcycleFee}  className="bg-slate-100 border border-indigo-600 p-1 " type="number" name={day + '-motorcycle'} id={day + 'motorcycle'} />
                   
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        
      </div>
  
  );
}
