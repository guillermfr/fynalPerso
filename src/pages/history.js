import NavAccount from "../components/NavAccount";
import HistoryBody from "../components/HistoryBody";

const History = (categoriesSideMenu) => {
    return (
        <main className="flex flex-1">
            <NavAccount />
            <HistoryBody />
        </main>
    );
};

export default History;
