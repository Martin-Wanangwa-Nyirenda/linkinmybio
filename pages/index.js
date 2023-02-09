import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext';
import uploadForm from '../components/uploadForm';

export default function Home() {
  const { userInfo, currentUser } = useAuth();
  console.log(currentUser);
}
