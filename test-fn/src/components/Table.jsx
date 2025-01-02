import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { fetchUsers } from "@/services/auth";

function MyTable() {
    const [agents, setAgents] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Consolidated fetchAgentData function
    const fetchAgentData = async (search = "") => {
        try {
            const response = await fetchUsers({ search }); // Pass search query to API
            setAgents(response.data);
        } catch (error) {
            console.error("Error fetching agents:", error);
        }
    };

    // Fetch agents on mount and when searchQuery changes
    useEffect(() => {
        fetchAgentData(searchQuery);
    }, [searchQuery]);

    // Filter agents by status
    const filteredUsers = agents.filter((user) => {
        const matchesStatus =
            selectedStatus === "all" || (user.status && user.status.toLowerCase() === selectedStatus);
        const matchesSearch =
            user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });


    // Update user status
    const updateUserStatus = async (userId, newStatus) => {
        try {
            await fetch(`/api/update-user-status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: userId, status: newStatus }),
            });
            fetchAgentData(searchQuery); // Refetch data after updating
        } catch (error) {
            console.error("Error updating user status:", error);
        }
    };

    // Debounce search input to reduce API calls
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    const debouncedSearch = debounce((value) => setSearchQuery(value), 300);

    return (
        <>
            <div className="flex space-x-3 items-center mb-4 mx-2 ml-[20rem] w-[75%]">
                {/* Filter by Status */}
                <Select onValueChange={(value) => setSelectedStatus(value)}>
                    <SelectTrigger className="w-180px focus:outline-none focus:ring-1 focus:ring-green-500">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search for a user"
                    className="border-2 border-black-500 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 h-9"
                    onChange={(e) => debouncedSearch(e.target.value)}
                />
            </div>

            {/* Table Component */}
            <Table className="mx-2 ml-[20rem] w-[75%] rounded-lg shadow-lg shadow-gray-300">
                <TableCaption>Breaks Tracking</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Break Type</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsers.map((user, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.breakType}</TableCell>
                            <TableCell>{user.from}</TableCell>
                            <TableCell>{user.to}</TableCell>
                            <TableCell>{user.status}</TableCell>
                            <TableCell>
                                {/* Dropdown Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="center">
                                        <DropdownMenuItem
                                            onClick={() => updateUserStatus(user.id, "Approved")}
                                            disabled={user.status !== "Pending"}
                                        >
                                            Approve
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => updateUserStatus(user.id, "Rejected")}
                                            disabled={user.status !== "Pending"}
                                        >
                                            Reject
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}

export default MyTable;
