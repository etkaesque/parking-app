import React, { useState } from 'react';
import axios from 'axios';
import Pricing from './components/pricing';
import PricingEdit from './components/pricingEdit';
import PlateScaner from './components/plateScaner';

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
};

export default function Home({ data }: pricingType) {
  const [isEditing, setIsEditing] = useState(true);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <main className="grid justify-center max-w-4xl mx-auto">
      <h2 className="text-xl pl-5">Vehicle Scanner</h2>
      <PlateScaner />
      <h2 className="text-xl pl-5">Pricing</h2>
      <div className="flex flex-col">
        {isEditing ? (
          <Pricing data={data} toggle={handleEditClick} />
        ) : (
          <PricingEdit data={data} toggle={handleEditClick} />
        )}
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  try {
    const response = await axios.get('https://park-ce8m.onrender.com/getPricing');
    const data = response.data.pricing[0];
    return { props: { data } };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { props: { data: null } };
  }
}
