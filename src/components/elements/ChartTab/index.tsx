// const TabGroup = ({ active, setActive, data }) => {
//   return (
//     <section className="border-light-grey-2 p-0 mb-2">
//       <div className="flex items-center">
//         {data &&
//           data.map((item) => (
//             <div className={`${item.id !== 1 ? 'ml-5' : null}`} key={item.id}>
//               <Tab
//                 active={active === item.name.toLocaleLowerCase()}
//                 onClick={() => setActive(item.name.toLocaleLowerCase())}
//                 label={item.name}
//               />
//             </div>
//           ))}
//       </div>
//     </section>
//   );
// };

interface ChartTabProp {
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>> | any; //any type was infered for number values
  data: { id: number; title: string; day: number; interval: string }[];
}

interface ChartTabMenuProp {
  label: string;
  active: boolean;
  onClick: () => void;
}

const TabMenu: React.FC<ChartTabMenuProp> = ({ label, active, onClick }) => {
  return (
    <p
      className={`lg:block text-xs lg:px-4 p-[.8rem] text-white hover:text-white hover:border-r-[.2rem] hover:border-r-primary rounded-lg hover:transition-all hover:ease-in ease-out transition-all cursor-pointer ${
        active ? 'bg-primary border-primary font-[500]' : 'bg-tifi-dark'
      }
                }`}
      onClick={onClick}
    >
      {label}
    </p>
  );
};

export const ChartTab: React.FC<ChartTabProp> = ({
  active,
  setActive,
  data,
}) => {
  return (
    <>
      <nav className="flex flex-start w-full  p-2 rounded-lg">
        {data &&
          data.map(
            (item: {
              id: number;
              title: string;
              day: number;
              interval: string;
            }) => (
              <div className={`${item.id !== 1 ? 'ml-3' : null}`} key={item.id}>
                <TabMenu
                  active={active === item.title.toLocaleLowerCase()}
                  onClick={() => setActive(item.title.toLocaleLowerCase())}
                  label={item.title}
                />
              </div>
            ),
          )}
      </nav>
      {/* mobile tab menu */}
    </>
  );
};
