import React from "react";
import styled from "styled-components";
import Link from "next/link";

const SidebarLink = styled.div`
    display: flex;
    flex-direction: row;
    color : #e1e9fc
    justify-content : space-between;
    align-items: center;
    padding : 20px;
    list-style : none;
    height: 60px;
    text-decoration: none;
    font-size: 18px;

    &:hover{
        background : #252831;
        border-left : 4px solid #632ce4;
        cursor: pointer;
    }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const SidebarMenu = ({item, closeSidebar}) => {
    return(
        <>
        <SidebarLink>
            <Link legacyBehavior href={item.path}>  
                <a onClick={closeSidebar}>
                    <div className="flex">
                        <span className="mt-1">{item.icon}</span>
                        <SidebarLabel>{item.title}</SidebarLabel>
                    </div>
                </a>  
            </Link>
        </SidebarLink>
        </>
    )
}

export default SidebarMenu;