import {
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Button,
    Icon,
    PreviewCard
} from "@/components";
import React, {useState} from "react";
import {useParams} from "react-router-dom";
import ProgramComponent from "@/components/pages/institution/program";
import {useYearContext} from "@/common/hooks/useYearContext";

const Program: React.FC = () => {
    const year = useYearContext();
    const {id} = useParams();
    const [modal, setModal] = useState<boolean>(false);

    return (
        <React.Fragment>
            <BlockHead>
                <BlockBetween>
                    <BlockHeadContent>
                        <BlockTitle tag="h5">Program Madrasah</BlockTitle>
                        <p>Data Program Tahun Ajaran {year?.name}</p>
                    </BlockHeadContent>
                    <BlockHeadContent>
                        <div className="toggle-wrap nk-block-tools-toggle">
                            <div className="toggle-expand-content" style={{display: "none"}}>
                                <ul className="nk-block-tools g-3">
                                    <li>
                                        <Button color="primary" size="sm" outline className="btn-white"
                                                onClick={() => setModal(true)}>
                                            <Icon name="plus"/>
                                            <span>TAMBAH</span>
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </BlockHeadContent>
                </BlockBetween>
            </BlockHead>
            <PreviewCard>
                <ProgramComponent institutionId={Number(id)} modal={modal} setModal={setModal}/>
            </PreviewCard>
        </React.Fragment>
    )
}

export default Program