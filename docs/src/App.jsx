import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Evaluation from './pages/Evaluation';
import QuantumFundamentals from './pages/QuantumFundamentals';
import Architecture from './pages/Architecture';
import VQCDeepDive from './pages/VQCDeepDive';
import DataPipeline from './pages/DataPipeline';
import Training from './pages/Training';
import StudentImpact from './pages/StudentImpact';
import BiggerPicture from './pages/BiggerPicture';

export default function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/evaluation" element={<Evaluation />} />
                <Route path="/quantum" element={<QuantumFundamentals />} />
                <Route path="/architecture" element={<Architecture />} />
                <Route path="/vqc" element={<VQCDeepDive />} />
                <Route path="/data-pipeline" element={<DataPipeline />} />
                <Route path="/training" element={<Training />} />
                <Route path="/impact" element={<StudentImpact />} />
                <Route path="/vision" element={<BiggerPicture />} />
            </Routes>
        </Layout>
    );
}
