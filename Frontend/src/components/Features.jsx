
import Card from "./Card";

function Features() {
  const features = [
    { title: "Credit-Based Learning", image: "CBL.png" },
    { title: "Peer-to-Peer Teaching", image: "PTP.png" },
    { title: "Skill Matching", image: "SM.png" },
    { title: "Secure Login", image: "SL.png" },
    { title: "User Profiles", image: "UP.png" },
     { title: "Rating & Review", image: "RR.png" },
  ];

  return (

     <div className="py-5 text-center"
     style={{
        backgroundImage: "url('/Featuresbg.jpg')", // put image in public folder
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>

    
    <div className="py-20  overflow-hidden">

      <h2 className=" font-[Space_Grotesk] text-4xl font-bold text-center mb-10">
        FEATURES
      </h2>

      {/* SCROLL CONTAINER */}
      <div className="relative mx-1 overflow-hidden  rounded-xl h-full p-5">

        {/* MOVING TRACK */}
        <div className="flex gap-6 w-max animate-scroll">

          {/* duplicate for infinite effect */}
          {[...features, ...features].map((item, index) => (
            <Card
              key={index}
              image={item.image}
              title={item.title}
               enableHoverEffect={false}
              className="min-w-62 "
            />
          ))}

        </div>
      </div>
    </div>
</div>    
  );
}

export default Features;