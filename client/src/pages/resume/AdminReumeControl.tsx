import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Tag,
  Popconfirm,
  message,
  Spin,
  Pagination,
} from "antd";
import axiosConfig from "../../config/axios.config";

const { Search } = Input;
const { Option } = Select;

// ----------------- TYPES -----------------
interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "student" | "employer";
  image?: { publicId: string; url: string; optimizedUrl: string };
  age?: number;
  gender?: string;
  dob?: string;
}

interface IFile {
  original: string;
  optimized: string;
}

interface IProfile {
  _id: string;
  userId: IUser;
  role: "student" | "employer";
  bio?: string;
  education?: string;
  experience?: string;
  skills?: string[];
  portfolioLinks?: string[];
  avatar?: IFile;
  resume?: IFile;
  companyName?: string;
  companyDescription?: string;
  companyAddress?: string;
  contactInfo?: string;
  companyLogo?: IFile;
  companyDocs?: IFile;
  category?: string | null;
  createdAt: string;
  updatedAt: string;
}

const AdminResumeControlPage = () => {
  const [profiles, setProfiles] = useState<IProfile[]>([]);
  const [search, setSearch] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalProfiles, setTotalProfiles] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const limit = 8;

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await axiosConfig.get("upload/all", {
        params: { page, limit, role: roleFilter },
      });

      const allProfiles = res.data.data ?? [];
      setProfiles(allProfiles);

      setTotalProfiles(res.data.pagination?.total || allProfiles.length);
    } catch (err: any) {
      console.error("Error fetching profiles:", err);
      message.error(err?.response?.data?.message || "Failed to fetch profiles");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProfiles();
  }, [page, roleFilter]);

  useEffect(() => {
    setPage(1);
    fetchProfiles();
  }, [roleFilter]);


  const handleDelete = async (id: string) => {
    try {
      await axiosConfig.delete(`upload/admin/${id}`);
      message.success("Profile deleted successfully");
      fetchProfiles();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Failed to delete profile");
    }
  };

  const isRecentlyUpdated = (updatedAt: string) => {
    const diff = new Date().getTime() - new Date(updatedAt).getTime();
    return diff < 24 * 60 * 60 * 1000;
  };

  const filteredProfiles = profiles.filter((profile) => {
    const name = profile.userId?.name?.toLowerCase() || "";
    const email = profile.userId?.email?.toLowerCase() || "";
    const query = search.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  return (
    <>
      <div className="p-6 max-w-[1800px] mx-auto">
        <div className="flex flex-wrap gap-3 mb-6">
          <Search
            placeholder="Search by name or email"
            className="flex-shrink-0"
            style={{ width: 250 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
          <Select
            placeholder="Filter by role"
            className="flex-shrink-0"
            style={{ width: 180 }}
            value={roleFilter}
            onChange={(val) => setRoleFilter(val)}
            allowClear
          >
            <Option value="">All Roles</Option>
            <Option value="student">Student</Option>
            <Option value="employer">Employer</Option>
          </Select>
          <Input
            placeholder="Delete by ID"
            style={{ width: 250 }}
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
          />
          <Button danger onClick={() => deleteId && handleDelete(deleteId)}>
            Delete
          </Button>
        </div>

        {loading ? (
          <Spin tip="Loading profiles..." size="large" className="block mx-auto mt-20" />
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">No profiles found.</div>
        ) : (
          <Row gutter={[24, 24]}>
            {filteredProfiles.map((profile) => {
              const role = profile.role?.toLowerCase();
              const recentlyUpdated = isRecentlyUpdated(profile.updatedAt);

              return (
                <Col
                  key={profile._id}
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  xl={6}
                  xxl={4}
                >
                  <Card
                    title={
                      role === "student" ? (
                        <div className="flex flex-col gap-2 items-center">
                          <span>{profile.userId?.name || "Unknown Student"}</span>
                          <span
                            style={{
                              fontSize: 13,
                              wordBreak: "break-all",
                              textAlign: "center",
                              color: "gray",
                            }}
                          >
                            {profile.userId?.email || "Unknown email"}
                          </span>
                          <Tag color={recentlyUpdated ? "magenta" : "blue"}>Student</Tag>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 items-center">
                          <span>{profile.companyName || "Unknown Company"}</span>
                          <span
                            style={{
                              fontSize: 13,
                              wordBreak: "break-all",
                              textAlign: "center",
                              color: "gray",
                            }}
                          >
                            {profile.userId?.email || "Unknown email"}
                          </span>
                          <span style={{ fontSize: 12, color: "gray" }}>
                            Employer: {profile.userId?.name || "Unknown"}
                          </span>
                          <Tag color={recentlyUpdated ? "magenta" : "green"}>Employer</Tag>
                        </div>
                      )
                    }
                    style={{
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      height: "100%",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    bodyStyle={{ display: "flex", flexDirection: "column", gap: 8 }}
                    actions={[
                      <Popconfirm
                        key="delete"
                        title={
                          <div>
                            <p className="font-bold text-center">Are you sure?</p>
                            <p className="text-center text-sm">This action cannot be undone.</p>
                          </div>
                        }
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDelete(profile.userId._id)}
                        okButtonProps={{ danger: true }}
                      >
                        <Button type="text" danger>
                          Delete
                        </Button>
                      </Popconfirm>,
                    ]}
                  >
                    {role === "student" ? (
                      <>
                        {profile.avatar?.optimized && (
                          <img
                            src={profile.avatar.optimized}
                            alt="Avatar"
                            style={{
                              width: "100%",
                              maxHeight: 150,
                              objectFit: "cover",
                              borderRadius: 6,
                            }}
                          />
                        )}
                        <p style={{ wordBreak: "break-all" }}>
                          <strong>StId:</strong> {profile.userId?._id || "Unknown Student"}
                        </p>
                        <p>
                          <strong>Bio:</strong> {profile.bio || "N/A"}
                        </p>
                        <p>
                          <strong>Skills:</strong> {profile.skills?.join(", ") || "N/A"}
                        </p>
                        <p>
                          <strong>Education:</strong> {profile.education || "N/A"}
                        </p>
                        <p>
                          <strong>Experience:</strong> {profile.experience || "N/A"}
                        </p>
                        <p>
                          <strong>Portfolio:</strong>{" "}
                          {profile.portfolioLinks?.length
                            ? profile.portfolioLinks.map((link, i) => (
                              <a
                                key={i}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {link.includes("github") ? "GitHub" : `Link ${i + 1}`}
                              </a>
                            ))
                            : "N/A"}
                        </p>
                        <p>
                          <strong>Resume:</strong>{" "}
                          {profile.resume?.optimized ? (
                            <a
                              href={profile.resume.optimized}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </>
                    ) : (
                      <>
                        {profile.companyLogo?.optimized && (
                          <img
                            src={profile.companyLogo.optimized}
                            alt="Company Logo"
                            style={{
                              width: "100%",
                              maxHeight: 150,
                              objectFit: "cover",
                              borderRadius: 6,
                            }}
                          />
                        )}
                        <p style={{ wordBreak: "break-all" }}>
                          <strong>StId:</strong> {profile.userId?._id || "Unknown employer"}
                        </p>
                        <p>
                          <strong>Company Name:</strong> {profile.companyName || "N/A"}
                        </p>
                        <p>
                          <strong>Description:</strong> {profile.companyDescription || "N/A"}
                        </p>
                        <p>
                          <strong>Address:</strong> {profile.companyAddress || "N/A"}
                        </p>
                        <p>
                          <strong>Contact:</strong> {profile.contactInfo || "N/A"}
                        </p>
                        <p>
                          <strong>Category:</strong> {profile.category || "N/A"}
                        </p>
                        <p>
                          <strong>Company Docs:</strong>{" "}
                          {profile.companyDocs?.optimized ? (
                            <a
                              href={profile.companyDocs.optimized}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </>
                    )}

                    <p>
                      <strong>Created At:</strong>{" "}
                      {new Date(profile.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>Updated At:</strong>{" "}
                      {new Date(profile.updatedAt).toLocaleString()}
                    </p>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        <div className="mt-6 flex justify-center">
          <Pagination
            current={page}
            pageSize={limit}
            total={totalProfiles}
            showSizeChanger={false}
            onChange={(p) => setPage(p)}
            className="flex justify-center"
          />
        </div>
      </div>
    </>
  );
};

export default AdminResumeControlPage;
