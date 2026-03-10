import Router from "./router";
import {YearProvider} from "@/layout/provider/year";
import {AuthProvider} from "@/layout/provider/auth";
import {InstitutionProvider} from "@/layout/provider/insitution";

const App = () => {
    return (
        <YearProvider>
            <AuthProvider>
                <InstitutionProvider>
                    <Router/>
                </InstitutionProvider>
            </AuthProvider>
        </YearProvider>
    );
};
export default App;