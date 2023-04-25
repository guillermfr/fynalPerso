import React, { useRef, useEffect, useState } from "react";
import SidebarMenu from "./SidebarMenu";
import styled from "styled-components";
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

const SidebarNav = styled.nav`
  background: rgb(28 25 23);
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};
  transition: 350ms;
  color: white;
`;
const SidebarWrap = styled.div`
  width: 100%;
`;

/*
* Component servant à afficher le menu sur le côté gauche.
*/
const Sidebar = ({ sidebarState }) => {
  if (!sidebarState) return null;

  const { data, error } = useSWR("/api/categoriesDataSidebar", fetcher);

  console.log(data);

  const [isOpen, setIsOpen] = useState(sidebarState);

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <>
      <SidebarNav className="sticky top-25 z-50" sidebar={isOpen} ref={menuRef}>
        <SidebarWrap>
          {data === undefined ? null : data.map((item, index) => {
            return (
              <SidebarMenu
                item={item}
                key={index}
                closeSidebar={() => setIsOpen(false)}
              />
            );
          })}
        </SidebarWrap>
      </SidebarNav>
    </>
  );
};

export default Sidebar;
