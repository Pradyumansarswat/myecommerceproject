import React from 'react'

const Skeleton = () => {
  return (
    <>
      <section className=" h-screen">
        <div className="animate-pulse w-1/2 h-12 rounded-md mb-3 bg-gray-300"></div>
        <div className="animate-pulse w-1/2 h-10 rounded-md mb-3 bg-gray-200"></div>
        <div className="animate-pulse w-1/2 h-10 rounded-md mb-3 bg-gray-300"></div>
        <div className="animate-pulse w-1/2 h-10 rounded-md mb-3 bg-gray-400"></div>
      </section>
    </>
  );
}

export default Skeleton
