

import axios from "axios";
import { File } from "buffer";
import { useState } from "react";


export default function PlateScaner() {

  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<String>("")

   
  const handleSubmit = async (event : any) => {
    event.preventDefault()

    if(!file) {
        console.error("File not selected")
        setMessage("Please choose a picture.")
        return;

    }

    const formData = new FormData();
    formData.append("upload", file as any)
    formData.append("regions", "lt")

    
    try {
        const response = await axios.post("https://api.platerecognizer.com/v1/plate-reader/",formData, {
            headers: {
              'Authorization': `Token ${process.env.NEXT_PUBLIC_TOKEN}`
            }})

        const licence_plate = response.data.results[0].plate

        const vehicle_type = response.data.results[0].vehicle.type

        const detectedVehicle = {
            vehicle_type: vehicle_type,
            licence_plate: licence_plate,
          };

          console.log(detectedVehicle)
        if (detectedVehicle.licence_plate !== "" && detectedVehicle.vehicle_type !== "" ) {

            const serverResponse = await axios.post("https://13.49.77.37:8000/vehicleCheck", detectedVehicle)
           
            const res = serverResponse.data.response
  

            if (serverResponse.data.arrival) {
              setMessage(`Welcome, ${res.licence_plate} :)`)
            } else {
                      
              const lastVisitIndex = res.visits.length - 1;
              const lastVisit = res.visits[lastVisitIndex];

              let time : number;
              let timeMessage

              if(lastVisit.hours >= 1) {
                time = parseFloat(lastVisit.hours.toFixed(2));
                timeMessage = `${time} hours` 
              }

              if (lastVisit.hours < 1) {
                time = Math.round(lastVisit.hours*60) 
                console.log("minutes time", time)
                timeMessage = `${time} minutes` 
                  if (time < 1) {
                    time = Math.round(lastVisit.hours*60*60)
                    console.log("seconds time", time)
                    timeMessage = `${time} seconds`
                  }

              } 



              setMessage(`Goodbye, ${res.licence_plate}. You should pay ${lastVisit.fee} €, you spent here ${timeMessage}`)
            }


        }

   
      

    } catch (error) {
        console.log(error)
    }


  }

  const handleFile =  (event : any) => {
   const file = event.target.files[0]
   setFile(file)
    
  }

  

  return (


    <div className="mb-3">

            <form action="submit" onSubmit={handleSubmit}>

            <label
                htmlFor="formFile"
                className="mb-2 inline-block text-neutral-700 dark:text-neutral-200"
                >Choose an image</label>
            <input onChange={handleFile}
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                type="file"
                id="formFile" />


 

              

                <button type="submit" className="p-2  border-2 my-2 mx-0 hover:bg-neutral-200 " >Submit</button>
                <span className="ml-2">{message}</span>




            

       
            </form>
     


                
                
                
    </div>
    
    


    
    
  );
}
