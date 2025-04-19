import React, { useState } from "react";
import { examPapers } from "../assets/assets";
import DropdownButton from "../components/DropdownButton";
import ExamPaperCard from "../components/ExamPaperCard";


const ExamDivDashboard = () => {
  // Filters state
  const [filters, setFilters] = useState({
    subject: "",
    year: "",
    session: "",
  });

  // Filter papers based on selected filters
  const filteredPapers = examPapers.filter((paper) => {
    const subjectMatch = filters.subject ? paper.subjectCode === filters.subject : true;
    const yearMatch = filters.year ? paper.year === filters.year : true;
    const sessionMatch = filters.session ? paper.session === filters.session : true;

    // If all filter conditions match, include the paper
    return subjectMatch && yearMatch && sessionMatch;
  });

  return (
    <div className="container mt-7  mx-auto p-4">
      {/* Filter Dropdowns */}
      <DropdownButton filters={filters} setFilters={setFilters} />

      {/* Displaying Papers */}
      <div className="flex flex-wrap justify-center mt-15">
        {filteredPapers.length > 0 ? (
          filteredPapers.map((paper, idx) => (
            <ExamPaperCard
              key={idx}
              subjectCode={paper.subjectCode}
              year={paper.year}
              session={paper.session}
            />
          ))
        ) : (
          <p>No papers found with the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default ExamDivDashboard;
