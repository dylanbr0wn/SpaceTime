// import { useRouter } from "next/router";
// import { Session } from "next-auth";
// import { getSession } from "next-auth/react";
// import * as React from "react";

// import ConfirmTenant from "../../../../components/register/ConfirmTenant";

// export const getServerSideProps = async (ctx) => {
//     const session = await getSession(ctx);
//     console.log(session);
//     if (!session) {
//         return {
//             redirect: {
//                 destination: "/api/auth/signin",
//                 permanent: false,
//             },
//         };
//     }
//     return {
//         props: {
//             session,
//         },
//     };
// };

const Token = () =>
    // { session }: { session: Session }
    {
        // return <ConfirmTenant userData={session} />;
        return <div />;
    };
export default Token;
