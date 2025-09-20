import React, { useState, useRef, useEffect } from "react";

// Extend the Window interface to include the dynamically loaded libraries
declare global {
  interface Window {
    html2canvas: any;
    jspdf: {
      jsPDF: any;
    };
  }
}

// Interface for personal information
interface PersonalInfo {
  fullName?: string;
  professionalTitle?: string;
  phone?: string;
  location?: string;
  email?: string;
  linkedin?: string;
  presentation?: string;
}

// Interface for experience
interface Experience {
  jobTitle?: string;
  title?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  isCurrentPosition?: boolean;
  description?: string;
}

// Interface for education
interface Education {
  diploma?: string;
  degree?: string;
  institution?: string;
  startYear?: string;
  startDate?: string;
  endYear?: string;
  endDate?: string;
}

// Interface for skill
interface Skill {
  name?: string;
}

// Interface for language
interface Language {
  name?: string;
  language?: string;
  level?: string;
}

// Main profile data interface
interface ProfileData {
  personalInfo?: PersonalInfo;
  experiences?: Experience[];
  education?: Education[];
  skills?: (string | Skill)[];
  languages?: Language[];
}

// Props interface for the component
interface CVGeneratorProps {
  profileData: ProfileData;
}

// Inline SVG for the Download icon
const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

// Inline SVG for the Loader icon
const LoaderIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="animate-spin"
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// Main component, now fully typed
export function CVGenerator({ profileData }: CVGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const cvRef = useRef<HTMLDivElement>(null);

  // Load the necessary scripts from CDN only once
  useEffect(() => {
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"),
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"),
    ]).catch(console.error);
  }, []);

  // Function to generate and download the PDF
  const generatePDF = async (): Promise<void> => {
    if (!profileData || !cvRef.current) return;

    setIsGenerating(true);
    try {
      const { html2canvas, jspdf } = window;
      const jsPDF = jspdf.jsPDF;

      if (!html2canvas || !jsPDF) {
        console.error("Required libraries not loaded");
        return;
      }

      const canvas = await html2canvas(cvRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName =
        `cv-${profileData.personalInfo?.fullName?.toLowerCase().replace(/\s+/g, "-") || "profil"}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!profileData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">
          Aucune donnée de profil disponible pour générer le CV
        </p>
      </div>
    );
  }

  // Formatting functions for the data
  const formatExperiences = () => {
    if (!profileData.experiences?.length) return [];
    return profileData.experiences.slice(0, 3).map((exp: Experience) => ({
      title: exp.jobTitle || exp.title || "Poste non spécifié",
      company: exp.company || "Entreprise non spécifiée",
      period: `${exp.startDate || ""} - ${exp.endDate || (exp.isCurrentPosition ? "Présent" : "")}`,
      description: exp.description || "Description non disponible",
      tasks: exp.description ? exp.description.split(".").filter(Boolean).slice(0, 3) : [],
    }));
  };

  const formatEducation = () => {
    if (!profileData.education?.length) return [];
    return profileData.education.slice(0, 3).map((edu: Education) => ({
      degree: edu.diploma || edu.degree || "Diplôme non spécifié",
      institution: edu.institution || "Institution non spécifiée",
      period: `${edu.startYear || edu.startDate || ""}-${edu.endYear || edu.endDate || ""}`,
    }));
  };

  const formatSkills = () => {
    if (!profileData.skills?.length)
      return ["Communication digitale", "Gestion de projet", "Réseaux sociaux", "Événementiel"];
    return profileData.skills
      .slice(0, 6)
      .map((skill: string | Skill) => (typeof skill === "string" ? skill : skill.name || "Compétence"))
      .filter(Boolean);
  };

  const formatLanguages = () => {
    if (!profileData.languages?.length)
      return [
        { name: "Français", level: "Langue maternelle" },
        { name: "Anglais", level: "Niveau avancé" },
      ];
    return profileData.languages.slice(0, 3).map((lang: Language) => ({
      name: lang.name || lang.language || "Langue",
      level: lang.level || "Niveau non spécifié",
    }));
  };

  const experiences = formatExperiences();
  const education = formatEducation();
  const skills = formatSkills();
  const languages = formatLanguages();

  return (
    <div className="flex flex-col items-center py-8 bg-gray-100">
      <div
        ref={cvRef}
        className="w-[8.5in] h-[11in] shadow-lg bg-white p-8 flex overflow-hidden font-inter"
      >
        {/* Left Panel */}
        <div className="w-1/3 bg-[#384259] text-white p-8 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <img
              src="https://placehold.co/150x150/e2e8f0/384259?text=Photo"
              alt="Profile Photo"
              className="w-28 h-28 rounded-full border-4 border-white"
            />
            <h1 className="text-2xl font-bold text-center">
              {profileData.personalInfo?.fullName || "Prénom NOM"}
            </h1>
            <p className="text-sm font-light text-center">
              {profileData.personalInfo?.professionalTitle || "ASSISTANT DE COMMUNICATION"}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-lg font-semibold border-b-2 border-solid border-[#5a6b8a] pb-2 mb-4">
              CONTACT
            </h2>
            <div className="text-xs space-y-1">
              <p>
                <strong className="font-semibold">Phone:</strong>{" "}
                <span>{profileData.personalInfo?.phone || "06 66 66 66 66"}</span>
              </p>
              <p>
                <strong className="font-semibold">Location:</strong>{" "}
                <span>{profileData.personalInfo?.location || "Paris, France"}</span>
              </p>
              <p>
                <strong className="font-semibold">Email:</strong>{" "}
                <span>{profileData.personalInfo?.email || "prenom.nom@mail.com"}</span>
              </p>
              <p>
                <strong className="font-semibold">LinkedIn:</strong>{" "}
                <span>{profileData.personalInfo?.linkedin || "/prenom.nom/"}</span>
              </p>
            </div>
          </div>

          {/* Compétences */}
          <div>
            <h2 className="text-lg font-semibold border-b-2 border-solid border-[#5a6b8a] pb-2 mb-4">
              COMPÉTENCES
            </h2>
            <ul className="list-disc list-inside text-xs space-y-1">
              {skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          {/* Langues */}
          <div>
            <h2 className="text-lg font-semibold border-b-2 border-solid border-[#5a6b8a] pb-2 mb-4">
              LANGUES
            </h2>
            <div className="text-xs space-y-1">
              {languages.map((lang, index) => (
                <p key={index}>
                  <strong className="font-semibold">{lang.name}:</strong> {lang.level}
                </p>
              ))}
            </div>
          </div>

          {/* Centres d'intérêt */}
          <div>
            <h2 className="text-lg font-semibold border-b-2 border-solid border-[#5a6b8a] pb-2 mb-4">
              CENTRES D'INTÉRÊT
            </h2>
            <ul className="list-disc list-inside text-xs space-y-1">
              <li>Equitation</li>
              <li>Bénévolat</li>
              <li>Musique</li>
            </ul>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-2/3 bg-white p-8 flex flex-col gap-6">
          {/* Profil */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-solid border-gray-200 pb-2 mb-4">
              PROFIL
            </h2>
            <p className="text-sm text-gray-700">
              {profileData.personalInfo?.presentation ||
                "Professionnel de la communication spécialisé dans la gestion de projets événementiels et le développement de contenus attractifs sur les réseaux sociaux. Fort d'expériences dans des entreprises de renom."}
            </p>
          </div>

          {/* Expériences professionnelles */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-solid border-gray-200 pb-2 mb-4">
              EXPÉRIENCES PROFESSIONNELLES
            </h2>
            <div className="space-y-4 text-sm text-gray-700">
              {experiences.length > 0 ? (
                experiences.map((exp, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-800">{exp.title}</h3>
                    <p className="text-gray-600">
                      {exp.company} | {exp.period}
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {exp.tasks.length > 0 ? (
                        exp.tasks.map((task, taskIndex) => (
                          <li key={taskIndex}>{task.trim()}.</li>
                        ))
                      ) : (
                        <li>{exp.description}</li>
                      )}
                    </ul>
                  </div>
                ))
              ) : (
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Assistant de Communication Digitale
                  </h3>
                  <p className="text-gray-600">Entreprise - Lieu | Période</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Coordination des campagnes de communication.</li>
                    <li>Création de visuels et textes pour les réseaux sociaux.</li>
                    <li>Participation à la mise en place d'événements.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Formation */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-solid border-gray-200 pb-2 mb-4">
              FORMATION
            </h2>
            <div className="space-y-4 text-sm text-gray-700">
              {education.length > 0 ? (
                education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                    <p className="text-gray-600">
                      {edu.institution} | {edu.period}
                    </p>
                  </div>
                ))
              ) : (
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Master en Communication et Médias
                  </h3>
                  <p className="text-gray-600">Institution - Lieu | Période</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center mt-8">
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-[#4a90e2] text-white font-semibold py-3 px-6 rounded-lg transition-colors hover:bg-[#357bd8] disabled:bg-[#4a90e2]/70 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <LoaderIcon className="w-4 h-4" />
              Génération...
            </>
          ) : (
            <>
              <DownloadIcon className="w-4 h-4" />
              Download as PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
}
