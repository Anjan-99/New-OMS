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

function User_Table() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [columnVisibility, setColumnVisibility] = useState({
    name: true,
    exchange: true,
    email: true,
    phone: true,
  });
  const itemsPerPage = 10;
  const selector = useSelector((state) => state.auth);
  const adminId = selector.user.adminId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await request.get(
        //   `/api/user/get_users?adminId=${adminId}`
        // );
        // setData(response.data.users);
        const response = await request.get(
          `https://6790de96af8442fd737817be.mockapi.io/users`
        );
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const getExchangeColor = (exchange) => {
    switch (exchange) {
      case "Kotak":
        return "bg-red-100 text-red-800";
      case "Jainam":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAndSortedData = data
    .filter((user) =>
      Object.values(user).some((value) =>
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
          <span>User Management</span>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search users..."
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
                  checked={columnVisibility.name}
                  onCheckedChange={() => toggleColumnVisibility("name")}
                >
                  Name
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.exchange}
                  onCheckedChange={() => toggleColumnVisibility("exchange")}
                >
                  Exchange
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.email}
                  onCheckedChange={() => toggleColumnVisibility("email")}
                >
                  Email
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.phone}
                  onCheckedChange={() => toggleColumnVisibility("phone")}
                >
                  Phone
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="border ">
          <TableHeader className="border-b rounded-lg">
            <TableRow>
              {columnVisibility.name && (
                <TableHead
                  className="border-r hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name
                  <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </TableHead>
              )}
              {columnVisibility.exchange && (
                <TableHead
                  className="border-r hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSort("exchange")}
                >
                  Exchange
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
              {columnVisibility.phone && (
                <TableHead
                  className="border-r hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSort("phone")}
                >
                  Phone
                  <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </TableHead>
              )}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((user) => (
              <TableRow key={user.id} className="border-b">
                {columnVisibility.name && (
                  <TableCell className="border-r">{user.name}</TableCell>
                )}
                {columnVisibility.exchange && (
                  <TableCell className="border-r">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getExchangeColor(user.exchange)}`}
                    >
                      {user.exchange}
                    </span>
                  </TableCell>
                )}
                {columnVisibility.email && (
                  <TableCell className="border-r">{user.email}</TableCell>
                )}
                {columnVisibility.phone && (
                  <TableCell className="border-r">{user.phone}</TableCell>
                )}
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => alert(`Edit ${user.name}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => alert(`Delete ${user.name}`)}
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

export { User_Table };
