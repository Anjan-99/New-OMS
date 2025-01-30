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

function Netpos_Table() {
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
    id: true,
    name: true,
    orderSide: true,
    ticker: true,
    qty: true,
    amount: true,
  });
  const itemsPerPage = 10;

  useEffect(() => {
    const demoData = [
      {
        id: 1,
        name: "Alice",
        orderSide: "Buy",
        ticker: "AAPL",
        qty: 10,
        amount: 1500,
      },
      {
        id: 2,
        name: "Bob",
        orderSide: "Sell",
        ticker: "GOOGL",
        qty: 5,
        amount: 2500,
      },
      {
        id: 3,
        name: "Charlie",
        orderSide: "Buy",
        ticker: "MSFT",
        qty: 8,
        amount: 2000,
      },
      {
        id: 4,
        name: "David",
        orderSide: "Sell",
        ticker: "AMZN",
        qty: 3,
        amount: 3000,
      },
      {
        id: 5,
        name: "Eve",
        orderSide: "Buy",
        ticker: "TSLA",
        qty: 12,
        amount: 4000,
      },
      {
        id: 6,
        name: "Frank",
        orderSide: "Sell",
        ticker: "NFLX",
        qty: 7,
        amount: 1800,
      },
      {
        id: 7,
        name: "Grace",
        orderSide: "Buy",
        ticker: "FB",
        qty: 9,
        amount: 1600,
      },
      {
        id: 8,
        name: "Hannah",
        orderSide: "Sell",
        ticker: "TWTR",
        qty: 4,
        amount: 1200,
      },
      {
        id: 9,
        name: "Ian",
        orderSide: "Buy",
        ticker: "BABA",
        qty: 11,
        amount: 3300,
      },
      {
        id: 10,
        name: "Jack",
        orderSide: "Sell",
        ticker: "PINS",
        qty: 6,
        amount: 1500,
      },
      {
        id: 11,
        name: "Kimi",
        orderSide: "Buy",
        ticker: "SPOT",
        qty: 14,
        amount: 2800,
      },
      {
        id: 12,
        name: "Liam",
        orderSide: "Sell",
        ticker: "UBER",
        qty: 13,
        amount: 3500,
      },
      {
        id: 13,
        name: "Mona",
        orderSide: "Buy",
        ticker: "LYFT",
        qty: 10,
        amount: 2200,
      },
      {
        id: 14,
        name: "Nina",
        orderSide: "Sell",
        ticker: "ZM",
        qty: 8,
        amount: 2400,
      },
      {
        id: 15,
        name: "Oliver",
        orderSide: "Buy",
        ticker: "ADBE",
        qty: 15,
        amount: 3000,
      },
      {
        id: 16,
        name: "Paul",
        orderSide: "Sell",
        ticker: "CRM",
        qty: 12,
        amount: 2600,
      },
      {
        id: 17,
        name: "Quinn",
        orderSide: "Buy",
        ticker: "NVDA",
        qty: 9,
        amount: 2700,
      },
      {
        id: 18,
        name: "Ryan",
        orderSide: "Sell",
        ticker: "AMD",
        qty: 10,
        amount: 2000,
      },
      {
        id: 19,
        name: "Sophia",
        orderSide: "Buy",
        ticker: "INTC",
        qty: 11,
        amount: 2200,
      },
      {
        id: 20,
        name: "Tom",
        orderSide: "Sell",
        ticker: "CSCO",
        qty: 14,
        amount: 2800,
      },
    ];
    setData(demoData);
    setLoading(false);
  }, []);

  const getorderSideColor = (orderSide) => {
    switch (orderSide) {
      case "Buy":
        return "bg-green-500 text-white";
      case "Sell":
        return "bg-red-500 text-white";
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

  return (
    <Card className="dark:bg-coal-300">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Net Position</span>
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
            <Button
              variant="destructive"
              onClick={() => {
                alert("Square off all positions");
              }}
            >
              Square Off
            </Button>
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
                  checked={columnVisibility.name}
                  onCheckedChange={() => toggleColumnVisibility("name")}
                >
                  Name
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.orderSide}
                  onCheckedChange={() => toggleColumnVisibility("orderSide")}
                >
                  Order Side
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.ticker}
                  onCheckedChange={() => toggleColumnVisibility("ticker")}
                >
                  Ticker
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.qty}
                  onCheckedChange={() => toggleColumnVisibility("qty")}
                >
                  Qty
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.amount}
                  onCheckedChange={() => toggleColumnVisibility("amount")}
                >
                  Amount
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
              {columnVisibility.name && (
                <TableHead
                  className="border-r hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name
                  <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </TableHead>
              )}
              {columnVisibility.orderSide && (
                <TableHead
                  className="border-r hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSort("orderSide")}
                >
                  Order Side
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
              {columnVisibility.qty && (
                <TableHead
                  className="border-r hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSort("qty")}
                >
                  Qty
                  <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </TableHead>
              )}
              {columnVisibility.amount && (
                <TableHead
                  className="border-r hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  Amount
                  <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </TableHead>
              )}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((netpos) => (
              <TableRow key={netpos.id} className="border-b">
                {columnVisibility.id && (
                  <TableCell className="border-r">{netpos.id}</TableCell>
                )}
                {columnVisibility.name && (
                  <TableCell className="border-r">{netpos.name}</TableCell>
                )}
                {columnVisibility.orderSide && (
                  <TableCell className="border-r">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${getorderSideColor(netpos.orderSide)}`}
                    >
                      {netpos.orderSide}
                    </span>
                  </TableCell>
                )}
                {columnVisibility.ticker && (
                  <TableCell className="border-r">{netpos.ticker}</TableCell>
                )}
                {columnVisibility.qty && (
                  <TableCell className="border-r">{netpos.qty}</TableCell>
                )}
                {columnVisibility.amount && (
                  <TableCell className="border-r">{netpos.amount}</TableCell>
                )}
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => alert("View")}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => alert("Delete")}
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

export { Netpos_Table };
