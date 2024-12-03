import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import LineChart from "../components/LineChart";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ResponseTab({ formData, formID }) {
  const [responseData, setResponseData] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/get-response/${formID}`);
        if (data.responseData) {
          setResponseData(data.responseData);
        }
      } catch (error) {
        console.error("Response Fetch Error: " + error);
      }
    };

    if (formData) {
      setQuestions(formData.questions);
    }

    if (formID !== undefined && formID !== "") {
      fetchData();
    }

    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(interval);
  }, [formID, formData]);

  const getAnswerText = (questionType, answer, options) => {
    switch (questionType) {
      case "multipleChoice":
        return (
          options.find((option) => option._id === answer)?.optionText ||
          "Not attempted"
        );
      case "checkbox":
        return (
          options
            .filter((option) => answer.includes(option._id))
            .map((option) => option.optionText)
            .join(", ") || "Not attempted"
        );
      case "dropdown":
        return (
          options.find((option) => option._id === answer)?.optionText ||
          "Not attempted"
        );
      case "shortAnswer":
        return answer || "Not attempted";
      default:
        return "Not attempted";
    }
  };

  const formatResponseData = (
    responseData,
    questions,
    getAnswerText,
    questionType
  ) => {
    return responseData
      .map((rs) => {
        return questions
          .filter((q) => q.questionType === questionType)
          .map((ques) => {
            const response = rs.response.find(
              (resp) => resp.questionID === ques._id
            );
            return response
              ? getAnswerText(ques.questionType, response.answer, ques.options)
              : "Not attempted";
          });
      })
      .map((arr) => arr[0]);
  };

  const mapChartData = (chartData) => {
    let output = {};
    chartData.forEach((ans) => {
      if (!output.hasOwnProperty(ans)) {
        output[ans] = 1;
      } else {
        output[ans]++;
      }
    });
    return Object.keys(output).map((key) => [key, output[key]]);
  };

  const renderCharts = () => {
    return questions.map((ques, index) => {
      const chartData = mapChartData(
        formatResponseData(
          responseData,
          questions,
          getAnswerText,
          ques.questionType
        )
      );
      let chartType;

      switch (ques.questionType) {
        case "multipleChoice":
        case "dropdown":
          chartType = "pie";
          break;
        case "checkbox":
          chartType = "bar";
          break;
        case "shortAnswer":
          chartType = "line";
          break;
        default:
          chartType = "column";
      }

      return (
        <Card
          key={index}
          sx={{
            marginBottom: "20px",
            border: "1px solid #ccc",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent>
            <Typography variant="h6" component="div">
              {ques.questionText}
            </Typography>
            <LineChart
              key={index}
              series={chartData}
              name={ques.questionText}
              index={index}
              chartType={chartType}
            />
          </CardContent>
        </Card>
      );
    });
  };

  return (
    <div style={{ marginTop: "150px", padding: "5px" }}>
      <TableContainer
        component={Paper}
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Table style={{ minWidth: 700 }} aria-label="responses table">
          <TableHead>
            <TableRow style={{ backgroundColor: "teal", color: "white" }}>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                User
              </TableCell>
              {questions.map((ques, i) => (
                <TableCell
                  key={i}
                  align="right"
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                  }}
                >
                  {i + 1}. {ques.questionText}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {responseData.map((rs, j) => (
              <TableRow
                key={j}
                style={{ backgroundColor: j % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  style={{ fontWeight: "bold" }}
                >
                  {rs.userID}
                </TableCell>
                {questions.map((ques, i) => {
                  const response = rs.response.find(
                    (resp) => resp.questionID === ques._id
                  );
                  return (
                    <TableCell
                      key={i}
                      align="right"
                      style={{ padding: "16px" }}
                    >
                      {response
                        ? getAnswerText(
                            ques.questionType,
                            response.answer,
                            ques.options
                          )
                        : "Not attempted"}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <br />
      <br />
      <br />
      {renderCharts()}
    </div>
  );
}
