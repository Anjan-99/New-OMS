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

function Admin_Table() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [columnVisibility, setColumnVisibility] = useState({
    username: true,
    email: true,
    role: true,
    createdAt: true,
  });
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get(`/api/auth/get_admins`);
        setData(response.data.admins);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setLoading(false);
      }
    };
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
    .filter((admin) =>
      Object.values(admin).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
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

  return (
    <Card className="dark:bg-coal-300">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Admin Management</span>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" /> Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.username}
                  onCheckedChange={() => toggleColumnVisibility("username")}
                >
                  Username
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.email}
                  onCheckedChange={() => toggleColumnVisibility("email")}
                >
                  Email
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.role}
                  onCheckedChange={() => toggleColumnVisibility("role")}
                >
                  Role
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.createdAt}
                  onCheckedChange={() => toggleColumnVisibility("createdAt")}
                >
                  Created At
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
              {columnVisibility.username && (
                <TableHead
                  className="border-r hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSort("username")}
                >
                  Username
                  <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </TableHead>
              )}
              {columnVisibility.email && (
                <TableHead
                  className="border-r hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email
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
              {columnVisibility.createdAt && (
                <TableHead
                  className="border-r hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Created At
                  <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </TableHead>
              )}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((admin) => (
              <TableRow key={admin.adminId} className="border-b">
                {columnVisibility.username && (
                  <TableCell className="border-r">{admin.username}</TableCell>
                )}
                {columnVisibility.email && (
                  <TableCell className="border-r">{admin.email}</TableCell>
                )}
                {columnVisibility.role && (
                  <TableCell className="border-r">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(admin.role)}`}
                    >
                      {admin.role}
                    </span>
                  </TableCell>
                )}
                {columnVisibility.createdAt && (
                  <TableCell className="border-r">
                    {new Date(admin.createdAt).toLocaleString()}
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => alert(`Edit ${admin.adminId}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => alert(`Delete ${admin.adminId}`)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
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

export { Admin_Table };
