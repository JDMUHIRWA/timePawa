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
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { fetchUsers } from "@/services/auth";
import { getSwapRequests, updateSwapRequest } from "../services/requests";

function MyTable() {
    const [agents, setAgents] = useState([]);
    // const [selectedStatus, setSelectedStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    // const [filteredAgents, setFilteredAgents] = useState([]);

    useEffect(() => {
        // Consolidated fetchAgentData function
        const fetchAgentData = async () => {
            try {
                const response = await getSwapRequests();
                if (Array.isArray(response)) {
                    setAgents(response);
                    console.log("Fetched agents:", response);
                } else {
                    console.error("Unexpected response format:", response);
                }
            } catch (error) {
                console.error("Error fetching agents:", error);
            }
        };
        fetchAgentData();
    }, []);

    // // Fetch agents on mount and when searchQuery changes
    // useEffect(() => {
    //     const lowerCaseQuery = searchQuery.toLowerCase();
    //     const filtered = agents.filter((agent) =>
    //         agent.username.toLowerCase().includes(lowerCaseQuery)
    //     );
    //     setFilteredAgents(filtered);
    // }, [agents, searchQuery]);

    // // Filter agents by status
    // const filteredUsers = agents.filter((user) => {
    //     const matchesStatus =
    //         selectedStatus === "all" || (user.status && user.status.toLowerCase() === selectedStatus);
    //     const matchesSearch =
    //         user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase());
    //     return matchesStatus && matchesSearch;
    // });


    // Update user status
    const updateUserStatus = async (requestid, newStatus) => {
        // const validActions = ["APPROVED", "REJECTED"];

        // if (!validActions.includes(newStatus)) {
        //     console.error(`Invalid action: ${newStatus}. Use "APPROVED" or "REJECTED".`);
        //     return;
        // }

        try {
            const update = await updateSwapRequest(requestid, newStatus);
            console.log("Updated user status:", update);
            const refreshedAgents = await getSwapRequests();
            setAgents(refreshedAgents);
        } catch (error) {
            console.error("Error updating user status:", error);
        }
    };

    // filter agents for the search
    const filteredAgents = agents
        .filter((agent) =>
            agent.initiator.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // // Debounce search input to reduce API calls
    // const debounce = (func, delay) => {
    //     let timeout;
    //     return (...args) => {
    //         clearTimeout(timeout);
    //         timeout = setTimeout(() => func(...args), delay);
    //     };
    // };

    // const debouncedSearch = debounce((value) => setSearchQuery(value), 300);

    return (
        <>
            <div className="flex space-x-3 items-center mb-4 mx-2 ml-[20rem] w-[75%]">
                {/* Filter by Status */}
                {/* <Select onValueChange={(value) => setSelectedStatus(value)}>
                    <SelectTrigger className="w-180px focus:outline-none focus:ring-1 focus:ring-green-500">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select> */}

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search for a user"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-2 border-black-500 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 h-9"
                />
            </div>

            {/* Table Component */}
            <Table className=" ml-[20rem] w-[75%] rounded-lg shadow-lg shadow-gray-300">
                <TableCaption>Breaks Tracking</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Initiator</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredAgents.map((data, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell>{data.initiator}</TableCell>
                            <TableCell>{data.target}</TableCell>
                            <TableCell>{data.from}</TableCell>
                            <TableCell>{data.to}</TableCell>
                            <TableCell>{data.status}</TableCell>
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
                                            onClick={() => updateUserStatus(data._id, "APPROVED")}
                                            disabled={data.status !== "PENDING"}
                                        >
                                            Approve
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => updateUserStatus(data._id, "REJECTED")}
                                            disabled={data.status !== "PENDING"}
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
