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
    <div
      className="py-8 text-center sm:py-10"
      style={{
        backgroundImage: "url('/Featuresbg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="app-shell overflow-hidden py-12 sm:py-16 xl:py-20 ">
        <h2 className="text-fluid-h2 mb-10 text-center font-[Space_Grotesk] font-bold">
          FEATURES
        </h2>

        <div className="relative overflow-hidden rounded-xl  p-2 sm:p-5">
          <div className="animate-scroll flex w-max gap-4 sm:gap-6">
            {[...features, ...features].map((item, index) => (
              <Card
                key={index}
                image={item.image}
                text={item.title}
                enableHoverEffect={false}
                className="h-64 min-w-[16rem] sm:h-72 sm:min-w-[18rem] xl:h-80 xl:min-w-[20rem]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;
