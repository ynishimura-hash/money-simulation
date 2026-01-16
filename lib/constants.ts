import { EducationLevel } from "./types";

// Source: MEXT (Ministry of Education, Culture, Sports, Science and Technology) 2021 Survey
// Annual costs in JPY
export const EDUCATION_COSTS = {
    kindergarten: {
        public: 165000,
        private: 309000
    },
    elementary: {
        public: 353000,
        private: 1667000
    },
    juniorHigh: {
        public: 539000,
        private: 1436000
    },
    highSchool: {
        public: 513000,
        private: 1054000
    },
    university: { // First year often higher, but averaging for simplicity or separating entrance fees could be better.
        // Approx annual tuition + facilities. 
        national_arts: 820000,
        national_science: 820000,
        private_arts: 1180000,
        private_science: 1550000
    }
};

export const DEFAULT_PENSION = {
    employee: 145000 * 12, // Kosei Nenkin avg
    self_employed: 65000 * 12, // Kokumin Nenkin only
    dependent: 65000 * 12, // Category 3
    none: 0
};
