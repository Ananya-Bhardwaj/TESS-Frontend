
export const fetchSubjects = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/subject", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        });
        if (!response.ok) {
        throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching subjects:", error);
        throw error;
    }
}

export const fetchInstitutions = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/institute", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        });
        if (!response.ok) {
        throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching institutions:", error);
        throw error;
    }
}

export const fetchPapers = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/papers", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        });
        if (!response.ok) {
        throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching papers:", error);
        throw error;
    }
}