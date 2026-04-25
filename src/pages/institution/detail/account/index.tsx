import {
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Button,
    Icon,
    PreviewCard
} from "@/components";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AccountComponent from "@/components/pages/institution/account";

const Account: React.FC = () => {
    const { id } = useParams();
    const [modal, setModal] = useState<boolean>(false);
    return (
        <React.Fragment>
            <BlockHead>
                <BlockBetween>
                    <BlockHeadContent>
                        <BlockTitle tag="h5">Data Rekening</BlockTitle>
                        <p>
                            Textual form controls—like <code className="code-tag">&lt;input&gt;</code>s,{" "}
                            <code className="code-tag">&lt;select&gt;</code>s, and{" "}
                        </p>
                    </BlockHeadContent>
                    <BlockHeadContent>
                        <div className="toggle-wrap nk-block-tools-toggle">
                            <div className="toggle-expand-content" style={{ display: "none" }}>
                                <ul className="nk-block-tools g-3">
                                    <li>
                                        <Button color="primary" size="sm" outline className="btn-white"
                                            onClick={() => setModal(true)}>
                                            <Icon name="plus" />
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
                <AccountComponent institutionId={Number(id)} modal={modal} setModal={setModal} />
            </PreviewCard>
        </React.Fragment>
    )
}

export default Account