import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import { Block, BlockHead, BlockHeadContent, BlockTitle, BlockDes, Row, Col, Icon, PreviewCard, ScheduleSkeleton } from "@/components";
import moment from "moment/moment";
import "moment/locale/id";
import { schedule } from "@/common/api/public";
import type { ScheduleData, ScheduleItem } from "@/types";

moment.locale('id');

const Schedule = () => {
    const [data, setData] = useState<ScheduleData | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await schedule();
                setData(result);
            } catch (error) {
                console.error("Error fetching schedule data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const generateDescription = (item: ScheduleItem) => {
        const isOpen = moment().isBetween(moment(item.start), moment(item.end));
        const isPast = moment().isAfter(moment(item.end));

        if (isPast) {
            return "Pendaftaran gelombang ini telah ditutup.";
        } else if (isOpen) {
            return `Segera daftarkan diri Anda di ${item.institution.surname}. Pendaftaran dibuka mulai tanggal ${moment(item.start).format('LL')} hingga ${moment(item.end).format('LL')}. Jangan lewatkan kesempatan ini!`;
        } else {
            return `Nantikan pembukaan pendaftaran gelombang ini pada tanggal ${moment(item.start).format('LL')}. Persiapkan berkas Anda dari sekarang.`;
        }
    };

    const getTimelineStatus = (item: ScheduleItem) => {
        const isOpen = moment().isBetween(moment(item.start), moment(item.end));
        const isPast = moment().isAfter(moment(item.end));
        if (isPast) return "bg-danger is-outline"; // Completed/Closed
        if (isOpen) return "bg-success"; // Active
        return "bg-warning is-outline"; // Upcoming
    };

    // Group schedules by Month Year
    const groupedSchedules = data?.schedules?.reduce((acc, item) => {
        const monthYear = moment(item.start).format("MMMM YYYY");
        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push(item);
        return acc;
    }, {} as Record<string, ScheduleItem[]>) || {};

    if (loading) {
        return <ScheduleSkeleton />;
    }

    return (
        <React.Fragment>
            <Head title="Jadwal Pendaftaran" />
            <Content page="component">
                <BlockHead size="sm">
                    <BlockHeadContent>
                        <BlockTitle page>Jadwal Pendaftaran</BlockTitle>
                        <BlockDes className="text-soft">
                            <p>Timeline pendaftaran siswa baru Tahun Ajaran {data?.year}.</p>
                        </BlockDes>
                    </BlockHeadContent>
                </BlockHead>

                <Block>
                    <Row className="gy-4">
                        <Col md={12}>
                            <PreviewCard>
                                <div className="card-inner border-bottom">
                                    <div className="card-title-group">
                                        <div className="card-title">
                                            <h6 className="title">Timeline Pelaksanaan</h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-inner">
                                    <div className="timeline">
                                        {Object.keys(groupedSchedules).length > 0 ? (
                                            Object.keys(groupedSchedules).map((monthYear) => (
                                                <React.Fragment key={monthYear}>
                                                    <h6 className="timeline-head">{monthYear}</h6>
                                                    <ul className="timeline-list">
                                                        {groupedSchedules[monthYear].map((item) => (
                                                            <li className="timeline-item" key={item.id}>
                                                                <div className={`timeline-status ${getTimelineStatus(item)}`}></div>
                                                                <div className="timeline-date">
                                                                    {moment(item.start).format("DD")} - {moment(item.end).format("DD")} <Icon name="calendar"></Icon>
                                                                </div>
                                                                <div className="timeline-data">
                                                                    <h6 className="timeline-title">{item.name} - {item.institution.surname}</h6>
                                                                    <div className="timeline-des">
                                                                        <p>{generateDescription(item)}</p>
                                                                        <span className="time text-muted small fst-italic">
                                                                            {moment(item.start).format('D MMM')} - {moment(item.end).format('D MMM YYYY')}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <div className="text-center p-3">Belum ada jadwal.</div>
                                        )}
                                    </div>
                                </div>
                            </PreviewCard>
                        </Col>
                    </Row>
                </Block>
            </Content>
        </React.Fragment>
    );
};

export default Schedule;
