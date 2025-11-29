import { Card, Row, Col, Input, Select, Button, Tag, Pagination, Popconfirm } from "antd";

const { Search } = Input;
const { Option } = Select;

const AdminResumeFetch = () => {
  return (
    <>
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-6">
          <Search placeholder="Search by name/email" style={{ width: 250 }} />
          <Select placeholder="Filter by role" style={{ width: 150 }}>
            <Option value="">All Roles</Option>
            <Option value="student">Student</Option>
            <Option value="employer">Employer</Option>
          </Select>
          <Input placeholder="Delete by ID" style={{ width: 250 }} />
          <Button danger>Delete</Button>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              title={
                <div className="flex justify-between items-center">
                  <span>John Doe</span>
                  <Tag color="blue">Student</Tag>
                </div>
              }
              actions={[
                <Popconfirm title="Delete this profile?" okText="Yes" cancelText="No">
                  <Button type="text" danger>Delete</Button>
                </Popconfirm>
              ]}
            >
              <img
                src="https://via.placeholder.com/150"
                alt="Avatar"
                style={{ width: "100%", maxHeight: 150, objectFit: "cover", marginBottom: 8 }}
              />
              <p><strong>Bio:</strong> Backend Developer</p>
              <p><strong>Skills:</strong> HTML, CSS, JS</p>
              <p><strong>Education:</strong> BSc Computer Science</p>
              <p><strong>Experience:</strong> 3 years</p>
              <p>
                <strong>Portfolio:</strong>{" "}
                <a href="#">GitHub</a>, <a href="#">Website</a>
              </p>
              <p><a href="#">Resume</a></p>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              title={
                <div className="flex justify-between items-center">
                  <span>Tech Solutions Pvt Ltd</span>
                  <Tag color="green">Employer</Tag>
                </div>
              }
              actions={[
                <Popconfirm title="Delete this profile?" okText="Yes" cancelText="No">
                  <Button type="text" danger>Delete</Button>
                </Popconfirm>
              ]}
            >
              <img
                src="https://via.placeholder.com/150"
                alt="Logo"
                style={{ width: "100%", maxHeight: 150, objectFit: "cover", marginBottom: 8 }}
              />
              <p><strong>Description:</strong> Software & IT Consulting</p>
              <p><strong>Address:</strong> Kathmandu, Nepal</p>
              <p><strong>Contact:</strong> +9779812345678</p>
              <p><a href="#">Company Docs</a></p>
            </Card>
          </Col>

        </Row>

        <div className="mt-6 flex justify-center">
          <Pagination current={1} pageSize={10} total={20} showSizeChanger={false} />
        </div>
      </div>
    </>
  );
};

export default AdminResumeFetch;
