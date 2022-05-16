import axios from "axios";
import { ContentDTO } from "../dto/content.dto";

class ContentService {
    contentURL = 'http://localhost:3000/v1/content-entries';

    getContentById(id: number) {
        return axios.get<ContentDTO>(this.contentURL + `/${id}`)
    }
}

export default new ContentService()