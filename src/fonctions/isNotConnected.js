import React from "react";

export default function isNotConnected(cookies) {
  if (!cookies.user) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
}
