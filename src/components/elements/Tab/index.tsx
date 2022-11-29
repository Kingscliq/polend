import { T } from 'react-translator-component';
interface TabProps {
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>> | any; //any type was infered for number values
  data: { id: number; name: string }[];
}

interface TabMenuProp {
  label: string;
  active: boolean;
  onClick: () => void;
}

const TabMenu: React.FC<TabMenuProp> = ({ label, active, onClick }) => {
  return (
    <p
      className={`capitalize lg:block text-sm lg:px-4 p-[.8rem]  text-white hover:text-white hover:border-r-[.2rem] hover:border-r-primary rounded-lg hover:transition-all hover:ease-in ease-out transition-all cursor-pointer ${
        active && 'bg-primary border-primary font-[500]'
      }`}
      onClick={onClick}
    >
      {label}
    </p>
  );
};

export const Tab: React.FC<TabProps> = ({ active, setActive, data }) => {
  return (
    <>
      <nav className="flex flex-start w-full bg-tifi-dark p-2 rounded-lg">
        {data &&
          data.map((item: any) => (
            <div className={`${item.id !== 1 ? 'ml-5' : null}`} key={item.id}>
              <TabMenu
                active={active === item.name.toLocaleLowerCase()}
                onClick={() => setActive(item.name.toLocaleLowerCase())}
                label={T(item.name)}
              />
            </div>
          ))}
      </nav>
      {/* mobile tab menu */}
    </>
  );
};
