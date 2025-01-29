import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpDown,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import request from "@/services/request";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

function Log_Table() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const selector = useSelector((state) => state.auth);
  const adminId = selector.user.adminId; // Assuming this comes from the Redux state
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState("all");
  const [users, setUsers] = useState([]);

  const [columnVisibility, setColumnVisibility] = useState({
    logname: true,
    user: true,
    role: true,
    datetime: true,
    logstatus: true,
    logmsg: true,
  });
  const itemsPerPage = 10;
  const fetchData = async () => {
    try {
      const response = await request.get(`/api/logs/getall_logs`);
      setData(response.data.logs);
      const userOptionsUnique = [
        ...new Set(response.data.logs.map((log) => log.user)),
      ];
      console.log(response.data.logs);
      const userOptions = userOptionsUnique.map((user) => ({
        value: user,
        label: user,
      }));
      setUsers([...new Set(userOptions)]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const getRoleColor = (role) => {
    switch (role) {
      case "ProfitFolio":
        return "bg-blue-100 text-blue-800";
      case "Employee":
        return "bg-green-100 text-green-800";
      case "DataEdge":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Success":
        return "bg-green-100 text-green-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const toggleColumnVisibility = (columnName) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
  };

  const filteredAndSortedData = data
    .filter((log) => {
      const matchesSearchTerm = Object.values(log).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesUser = selectedUser === "all" || log.user === selectedUser;
      return matchesSearchTerm && matchesUser;
    })
    .sort((a, b) => {
      if (!sortColumn) return 0;
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];
      return sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        Object.keys(filteredAndSortedData[0]).join(","), // Add headers
        ...filteredAndSortedData.map((log) =>
          Object.values(log)
            .map((value) => `"${value}"`) // Wrap values in quotes
            .join(",")
        ),
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteLogs = async () => {
    if (filteredAndSortedData.length === 0) {
      alert("No logs to delete.");
      return;
    }

    const logIds = filteredAndSortedData.map((log) => log._id);
    console.log("Deleting logs with IDs:", logIds);
    try {
      const response = await request.post(`/api/logs/delete_logs`, { logIds });
      console.log("Logs deleted successfully:", response.data);
      alert("Logs deleted successfully!");
      // remove deleted logs from the data
      const updatedData = data.filter((log) => !logIds.includes(log._id));
      setData(updatedData);
      // also update the users list
      const userOptionsUnique = [
        ...new Set(updatedData.map((log) => log.user)),
      ];
      const userOptions = userOptionsUnique.map((user) => ({
        value: user,
        label: user,
      }));
      setUsers([...new Set(userOptions)]);
      setSelectedUser("all");
    } catch (error) {
      console.error("Error deleting logs:", error);
      alert("Error deleting logs.");
    }
  };

  return (
    <Card className="dark:bg-coal-300">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Logs</span>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="max-w-xs"
            />
            <Select
              options={users}
              value={
                selectedUser === "all"
                  ? null
                  : users.find((user) => user.value === selectedUser)
              }
              onChange={(selectedOption) => {
                setSelectedUser(selectedOption ? selectedOption.value : "all");
                setCurrentPage(1);
              }}
              placeholder="Select user"
              className="react-select w-96 font-thin text-sm"
              classNamePrefix="dropdown"
              isClearable
            />
            <Button className="btn bg-danger" onClick={deleteLogs}>
              Delete Logs
            </Button>
            <Button className="btn bg-green-500" onClick={exportToCSV}>
              Export CSV
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" /> Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.logname}
                  onCheckedChange={() => toggleColumnVisibility("logname")}
                >
                  logname
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.user}
                  onCheckedChange={() => toggleColumnVisibility("user")}
                >
                  User
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.role}
                  onCheckedChange={() => toggleColumnVisibility("role")}
                >
                  Role
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.datetime}
                  onCheckedChange={() => toggleColumnVisibility("datetime")}
                >
                  Created At
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.logstatus}
                  onCheckedChange={() => toggleColumnVisibility("logstatus")}
                >
                  Log Status
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.logmsg}
                  onCheckedChange={() => toggleColumnVisibility("logmsg")}
                >
                  Log Message
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="border">
          <TableHeader className="border-b">
            <TableRow>
              {columnVisibility.logname && (
                <TableHead
                  className="border-r hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSort("logname")}
                >
                  Log Name
                  <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </TableHead>
              )}
              {columnVisibility.user && (
                <TableHead
                  className="border-r hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSort("user")}
                >
                  User
                  <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </TableHead>
              )}
              {columnVisibility.role && (
                <TableHead
                  className="border-r hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  Role
                  <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </TableHead>
              )}
              {columnVisibility.datetime && (
                <TableHead
                  className="border-r hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSort("datetime")}
                >
                  Created At
                  <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </TableHead>
              )}
              {columnVisibility.logstatus && (
                <TableHead
                  className="border-r hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSort("logstatus")}
                >
                  Log Status
                  <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </TableHead>
              )}
              {columnVisibility.logmsg && (
                <TableHead
                  className="border-r hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSort("logmsg")}
                >
                  Log Message
                  <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((logs) => (
              <TableRow key={logs._id} className="border-b">
                {columnVisibility.logname && (
                  <TableCell className="border-r">{logs.logname}</TableCell>
                )}
                {columnVisibility.user && (
                  <TableCell className="border-r">{logs.user}</TableCell>
                )}
                {columnVisibility.role && (
                  <TableCell className="border-r">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(logs.role)}`}
                    >
                      {logs.role}
                    </span>
                  </TableCell>
                )}
                {columnVisibility.datetime && (
                  <TableCell className="border-r">{logs.datetime}</TableCell>
                )}
                {columnVisibility.logstatus && (
                  <TableCell className="border-r">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(logs.logstatus)}`}
                    >
                      {logs.logstatus}
                    </span>
                  </TableCell>
                )}
                {columnVisibility.logmsg && (
                  <TableCell className="border-r">{logs.logmsg}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { Log_Table };
