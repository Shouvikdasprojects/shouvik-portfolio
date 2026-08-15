import { Metadata } from 'next';
import ResumeClient from './ResumeClient';

export const metadata: Metadata = {
  title: 'Executive Resume & Curriculum Vitae | Shouvik Das',
  description: 'Interactive Executive Resume & Professional CV for Shouvik Das — UI/UX Designer, Web3D Developer, and Digital Content Creator based in India.',
  openGraph: {
    title: 'Executive Resume & Curriculum Vitae | Shouvik Das',
    description: 'Explore Shouvik Das’s full technical skill matrix, creative channel metrics, shipped production projects, and verified credentials.',
    url: 'https://shouvikdasportfolio.qzz.io/resume',
    siteName: 'Shouvik Das Portfolio',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Executive Resume & Curriculum Vitae | Shouvik Das',
    description: 'Explore Shouvik Das’s full technical skill matrix, creative channel metrics, shipped production projects, and verified credentials.',
  },
  alternates: {
    canonical: 'https://shouvikdasportfolio.qzz.io/resume',
  },
};

export default function ResumePage() {
  return <ResumeClient />;
}
