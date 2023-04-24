import NavAccount from "../components/NavAccount";
import HistoryBody from "../components/HistoryBody";
import { getCategorieIdData } from "../fonctions/SidebarData";

export async function getStaticProps() {
  const categoriesSideMenu = await getCategorieIdData();
  return {
    props: {
      categoriesSideMenu,
    },
  };
}

const History = (categoriesSideMenu) => {
    return (
        <main className="flex flex-1">
            <NavAccount />
            <HistoryBody />
        </main>
    );
};

export default History;
