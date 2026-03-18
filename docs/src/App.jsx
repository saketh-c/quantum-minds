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
import PosterLeft from './pages/PosterLeft';
import PosterCenter from './pages/PosterCenter';
import PosterRight from './pages/PosterRight';
import PosterModel from './pages/PosterModel';
import UserJourney from './pages/UserJourney';
import AppFeatures from './pages/AppFeatures';
import ModelExplanation from './pages/ModelExplanation';
import CompletePoster from './pages/CompletePoster';
import DataTables from './pages/DataTables';
import AcademicEvaluation from './pages/AcademicEvaluation';
import AcademicAppFeatures from './pages/AcademicAppFeatures';
import AcademicModelExplanation from './pages/AcademicModelExplanation';
import AcademicArchitecture from './pages/AcademicArchitecture';
import AcademicPosterLeft from './pages/AcademicPosterLeft';
import AcademicPosterCenter from './pages/AcademicPosterCenter';
import AcademicPosterRight from './pages/AcademicPosterRight';
import AcademicCompletePoster from './pages/AcademicCompletePoster';
import AcademicModelDeepDive from './pages/AcademicModelDeepDive';

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
                <Route path="/poster-left" element={<PosterLeft />} />
                <Route path="/poster-center" element={<PosterCenter />} />
                <Route path="/poster-right" element={<PosterRight />} />
                <Route path="/poster-model" element={<PosterModel />} />
                <Route path="/user-journey" element={<UserJourney />} />
                <Route path="/app-features" element={<AppFeatures />} />
                <Route path="/model-explanation" element={<ModelExplanation />} />
                <Route path="/complete-poster" element={<CompletePoster />} />
                <Route path="/data-tables" element={<DataTables />} />
                <Route path="/academic-evaluation" element={<AcademicEvaluation />} />
                <Route path="/academic-app-features" element={<AcademicAppFeatures />} />
                <Route path="/academic-model-explanation" element={<AcademicModelExplanation />} />
                <Route path="/academic-architecture" element={<AcademicArchitecture />} />
                <Route path="/academic-poster-left" element={<AcademicPosterLeft />} />
                <Route path="/academic-poster-center" element={<AcademicPosterCenter />} />
                <Route path="/academic-poster-right" element={<AcademicPosterRight />} />
                <Route path="/academic-complete-poster" element={<AcademicCompletePoster />} />
                <Route path="/academic-model-deep-dive" element={<AcademicModelDeepDive />} />
            </Routes>
        </Layout>
    );
}
