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

function Holdings_Table() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState("all");
  const [users, setUsers] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    ticker: true,
    quantity: true,
    buyAvg: true,
    ltp: true,
    currentValue: true,
  });
  const itemsPerPage = 10;

  useEffect(() => {
    const demoData = [
      {
        id: 1,
        ticker: "AAPL",
        quantity: 10,
        buyAvg: 150,
        ltp: 155,
        currentValue: 1550,
      },
      {
        id: 2,
        ticker: "GOOGL",
        quantity: 5,
        buyAvg: 2500,
        ltp: 2550,
        currentValue: 12750,
      },
      {
        id: 3,
        ticker: "MSFT",
        quantity: 8,
        buyAvg: 2000,
        ltp: 2050,
        currentValue: 16400,
      },
      {
        id: 4,
        ticker: "AMZN",
        quantity: 3,
        buyAvg: 3000,
        ltp: 3100,
        currentValue: 9300,
      },
      {
        id: 5,
        ticker: "TSLA",
        quantity: 12,
        buyAvg: 4000,
        ltp: 4100,
        currentValue: 49200,
      },
      {
        id: 6,
        ticker: "NFLX",
        quantity: 7,
        buyAvg: 1800,
        ltp: 1850,
        currentValue: 12950,
      },
      {
        id: 7,
        ticker: "FB",
        quantity: 9,
        buyAvg: 1600,
        ltp: 1650,
        currentValue: 14850,
      },
      {
        id: 8,
        ticker: "TWTR",
        quantity: 4,
        buyAvg: 1200,
        ltp: 1250,
        currentValue: 5000,
      },
      {
        id: 9,
        ticker: "BABA",
        quantity: 11,
        buyAvg: 3300,
        ltp: 3350,
        currentValue: 36850,
      },
      {
        id: 10,
        ticker: "PINS",
        quantity: 6,
        buyAvg: 1500,
        ltp: 1550,
        currentValue: 9300,
      },
      {
        id: 11,
        ticker: "SPOT",
        quantity: 14,
        buyAvg: 2800,
        ltp: 2850,
        currentValue: 39900,
      },
      {
        id: 12,
        ticker: "UBER",
        quantity: 13,
        buyAvg: 3500,
        ltp: 3550,
        currentValue: 46150,
      },
      {
        id: 13,
        ticker: "LYFT",
        quantity: 10,
        buyAvg: 2200,
        ltp: 2250,
        currentValue: 22500,
      },
      {
        id: 14,
        ticker: "ZM",
        quantity: 8,
        buyAvg: 2400,
        ltp: 2450,
        currentValue: 19600,
      },
      {
        id: 15,
        ticker: "ADBE",
        quantity: 15,
        buyAvg: 3000,
        ltp: 3050,
        currentValue: 45750,
      },
      {
        id: 16,
        ticker: "CRM",
        quantity: 12,
        buyAvg: 2600,
        ltp: 2650,
        currentValue: 31800,
      },
      {
        id: 17,
        ticker: "NVDA",
        quantity: 9,
        buyAvg: 2700,
        ltp: 2750,
        currentValue: 24750,
      },
      {
        id: 18,
        ticker: "AMD",
        quantity: 10,
        buyAvg: 2000,
        ltp: 2050,
        currentValue: 20500,
      },
      {
        id: 19,
        ticker: "INTC",
        quantity: 11,
        buyAvg: 2200,
        ltp: 2250,
        currentValue: 24750,
      },
      {
        id: 20,
        ticker: "CSCO",
        quantity: 14,
        buyAvg: 2800,
        ltp: 2850,
        currentValue: 39900,
      },
    ];
    setData(demoData);
    setLoading(false);

    // Dummy users for the select field
    setUsers([
      { value: "all", label: "All Users" },
      { value: "user1", label: "User 1" },
      { value: "user2", label: "User 2" },
      { value: "user3", label: "User 3" },
    ]);
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

  const handleSubmit = () => {
    setShowTable(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Card className="dark:bg-coal-300 mb-4">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Select User</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Select
              options={users}
              value={users.find((user) => user.value === selectedUser)}
              onChange={(selectedOption) =>
                setSelectedUser(selectedOption.value)
              }
              placeholder="Select User"
              className="react-select w-96 font-thin text-sm"
              classNamePrefix="dropdown"
              isClearable
            />
            <Button variant="outline" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>

      {showTable && (
        <Card className="dark:bg-coal-300">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Holdings</span>
              <div className="flex items-center space-x-4">
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="max-w-xs"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Eye className="mr-2 h-4 w-4" /> Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem
                      checked={columnVisibility.id}
                      onCheckedChange={() => toggleColumnVisibility("id")}
                    >
                      ID
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={columnVisibility.ticker}
                      onCheckedChange={() => toggleColumnVisibility("ticker")}
                    >
                      Ticker
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={columnVisibility.quantity}
                      onCheckedChange={() => toggleColumnVisibility("quantity")}
                    >
                      Quantity
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={columnVisibility.buyAvg}
                      onCheckedChange={() => toggleColumnVisibility("buyAvg")}
                    >
                      Buy Avg
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={columnVisibility.ltp}
                      onCheckedChange={() => toggleColumnVisibility("ltp")}
                    >
                      LTP
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={columnVisibility.currentValue}
                      onCheckedChange={() =>
                        toggleColumnVisibility("currentValue")
                      }
                    >
                      Current Value
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
                  {columnVisibility.id && (
                    <TableHead
                      className="border-r hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      ID
                      <ArrowUpDown className="inline ml-2 h-4 w-4" />
                    </TableHead>
                  )}
                  {columnVisibility.ticker && (
                    <TableHead
                      className="border-r hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSort("ticker")}
                    >
                      Ticker
                      <ArrowUpDown className="inline ml-2 h-4 w-4" />
                    </TableHead>
                  )}
                  {columnVisibility.quantity && (
                    <TableHead
                      className="border-r hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSort("quantity")}
                    >
                      Quantity
                      <ArrowUpDown className="inline ml-2 h-4 w-4" />
                    </TableHead>
                  )}
                  {columnVisibility.buyAvg && (
                    <TableHead
                      className="border-r hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSort("buyAvg")}
                    >
                      Buy Avg
                      <ArrowUpDown className="inline ml-2 h-4 w-4" />
                    </TableHead>
                  )}
                  {columnVisibility.ltp && (
                    <TableHead
                      className="border-r hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSort("ltp")}
                    >
                      LTP
                      <ArrowUpDown className="inline ml-2 h-4 w-4" />
                    </TableHead>
                  )}
                  {columnVisibility.currentValue && (
                    <TableHead
                      className="border-r hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSort("currentValue")}
                    >
                      Current Value
                      <ArrowUpDown className="inline ml-2 h-4 w-4" />
                    </TableHead>
                  )}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((holding) => (
                  <TableRow key={holding.id} className="border-b">
                    {columnVisibility.id && (
                      <TableCell className="border-r">{holding.id}</TableCell>
                    )}
                    {columnVisibility.ticker && (
                      <TableCell className="border-r">
                        {holding.ticker}
                      </TableCell>
                    )}
                    {columnVisibility.quantity && (
                      <TableCell className="border-r">
                        {holding.quantity}
                      </TableCell>
                    )}
                    {columnVisibility.buyAvg && (
                      <TableCell className="border-r">
                        {holding.buyAvg}
                      </TableCell>
                    )}
                    {columnVisibility.ltp && (
                      <TableCell className="border-r">{holding.ltp}</TableCell>
                    )}
                    {columnVisibility.currentValue && (
                      <TableCell className="border-r">
                        {holding.currentValue}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex space-x-2">
                        {/* <Button
                          variant="outline"
                          size="icon"
                          onClick={() => alert("View")}
                        >
                          <Edit className="h-4 w-4" />
                        </Button> */}
                        <Button
                          variant="destructive"
                          size=""
                          onClick={() => alert("Square Off")}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="">Sqr Off</span>
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
      )}
    </div>
  );
}

export { Holdings_Table };
