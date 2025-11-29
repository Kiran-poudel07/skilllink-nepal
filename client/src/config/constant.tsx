import {
  AiOutlineBold,
  AiOutlineTeam,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineDollarCircle,
  AiOutlineProfile,
  AiOutlineFileText,
  AiOutlineDashboard ,
  AiOutlineUserSwitch,
  AiOutlineFolderOpen,
  AiOutlineStar ,
  AiTwotoneStar ,
  AiOutlineControl,
} from "react-icons/ai";
import { NavLink } from "react-router";


export const UserRoles = {
  ADMIN: "admin",
  STUDENT: "student",
  EMPLOYER: "employer",
} as const;

export interface ImageType {
    optimizedUrl: string,
    publicId: string,
    url: string
}

export type UserRole = typeof UserRoles[keyof typeof UserRoles];

export const Status = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type Status = typeof Status[keyof typeof Status];

export const Gender = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
} as const;

export type Gender = typeof Gender[keyof typeof Gender];


export const AdminMenu = [
  // { key: "1", icon: <AiOutlineHome />, label: <NavLink to="/home">Home</NavLink> },
  { key: "2", icon: <AiOutlineDashboard  />, label: <NavLink to="/admin/dashboard">Dashboard</NavLink> },
  { key: "3", icon: <AiOutlineProfile />, label: <NavLink to="/admin/resume">Resume</NavLink> },
  { key: "4", icon: <AiOutlineUserSwitch />, label: <NavLink to="/admin/applications">Applications</NavLink> },
  { key: "5", icon: <AiOutlineFolderOpen />, label: <NavLink to="/admin/gigview">GigsView</NavLink> },
  { key: "6", icon: (
    <div className="flex gap-1">
      <AiTwotoneStar className="text-yellow-400" />
      <AiOutlineStar className="text-yellow-400" />
      </div>), label: <NavLink to="/admin/review/EReview">Reviews</NavLink> },
  { key: "7", icon: <AiOutlineTeam />, label: <NavLink to="/admin/list/user">Users</NavLink> },
  { key: "8", icon: <AiOutlineDollarCircle />, label: <NavLink to="/admin/khalti/viewpayments">Transactions</NavLink> },
  { key: "9", icon: <AiOutlineControl />, label: <NavLink to="/admin/gigforadmin">GigAction</NavLink> },
];


export const EmployerMenu = [
  // { key: "1", icon: <AiOutlineHome />, label: <NavLink to="/">Home</NavLink> },
  { key: "2", icon: <AiOutlineDashboard  />, label: <NavLink to="/employer/dashboard">Dashboard</NavLink> },
  { key: "3", icon: <AiOutlineProfile />, label: <NavLink to="/employer/companyresume">Resume</NavLink> },
  { key: "4", icon: <AiOutlineBold />, label: <NavLink to="/employer/gig">Gig</NavLink> },
  { key: "5", icon: <AiOutlineTeam />, label: <NavLink to="/employer/applications">Applications</NavLink> },
  { key: "6", icon: <AiOutlineShopping />, label: <NavLink to="/employer/gigview/active">GigActive</NavLink> },
  // { key: "7", icon: <AiOutlineShoppingCart />, label: <NavLink to="/employer/initiatePayment">Payment</NavLink> },
  { key: "8", icon: <AiOutlineShoppingCart />, label: <NavLink to="/employer/khalti/transaction">Transactions</NavLink> },
  { key: "9", icon: (
    <div className="flex gap-1">
      <AiTwotoneStar className="text-yellow-400" />
      <AiOutlineStar className="text-yellow-400" />
      </div>), label: <NavLink to="/employer/review/EReview">Reviews</NavLink> },
    // { key: "9", icon: <AiOutlineMessage />, label: <NavLink to="/employer/chat">Chat</NavLink> },
    // { key: "9", icon: <AiOutlineMessage />, label: <NavLink to="/employer/chatnew">Chat</NavLink> },

];


export const StudentMenu = [
  // { key: "1", icon: <AiOutlineHome />, label: <NavLink to="/">Home</NavLink> },
  { key: "2", icon: <AiOutlineDashboard  />, label: <NavLink to="/student/dashboard">Dashboard</NavLink> },
  { key: "3", icon: <AiOutlineFileText />, label: <NavLink to="/student/resume">Resume</NavLink> },
  { key: "4", icon: <AiOutlineUserSwitch />, label: <NavLink to="/student/applications">Applications</NavLink> },
  { key: "5", icon: <AiOutlineFolderOpen />, label: <NavLink to="/student/gigview">Gig</NavLink> },
  { key: "6", icon: (
    <div className="flex gap-1">
      <AiTwotoneStar className="text-yellow-400" />
      <AiOutlineStar className="text-yellow-400" />
      </div>), 
      label: <NavLink to="/student/studentReview">Review</NavLink> },
  // { key: "7", icon: <AiOutlineShoppingCart />, label: <NavLink to="/admin/orders">Orders</NavLink> },
  // { key: "8", icon: <AiOutlineDollarCircle />, label: <NavLink to="/admin/transaction">Transactions</NavLink> },
  // { key: "9", icon: <AiOutlineMessage />, label: <NavLink to="/student/chat">Chat</NavLink> },
  // { key: "9", icon: <AiOutlineMessage />, label: <NavLink to="/student/chatnew">Chat</NavLink> },
];