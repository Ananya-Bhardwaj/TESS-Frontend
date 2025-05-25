import React, { useEffect, useState } from "react";
// import { examPapers } from "../assets/assets";
import DropdownButton from "../components/DropdownButton";
import ExamPaperCard from "../components/ExamPaperCard";
import { fetchPapers } from "../data";

const ExamDivDashboard = () => {
  // Filters state
  const [filters, setFilters] = useState({
    subject: "",
    year: "",
    session: "",
  });
  const [examPapers, setExamPapers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPapers();
        setExamPapers(data); // Assuming the response contains the exam papers data
      } catch (error) {
        console.error("Error fetching exam papers:", error);
      }
    }
    fetchData();
  }, []); 

  // Filter papers based on selected filters
  // const filteredPapers = examPapers.filter((paper) => {
  //   const subjectMatch = filters.subject ? paper.subject === filters.subject : true;
  //   const yearMatch = filters.year ? paper.year === filters.year : true;
  //   const sessionMatch = filters.session ? paper.exam_type === filters.session : true;

  //   // If all filter conditions match, include the paper
  //   return subjectMatch && yearMatch && sessionMatch;
  // });

  return (
    <div className="container mt-7  mx-auto p-4">
      {/* Filter Dropdowns */}
      <DropdownButton filters={filters} setFilters={setFilters} />

      {/* Displaying Papers */}
      <div className="flex flex-wrap justify-center mt-15">
        {examPapers.length > 0 ? (
          examPapers.map((paper, idx) => (
            <ExamPaperCard
              key={idx}
              subjectCode={paper.subject.subject_id}
              year={paper.subject.year}
              session={paper.exam_type}
              id={paper.paper_id}
              name={paper.name}
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
