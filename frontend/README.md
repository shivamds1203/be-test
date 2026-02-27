# be-test: The Future of Online Examinations

I built **be-test** to revolutionize how exams are conducted online. As education moves increasingly digital, maintaining exam integrity and making the process genuinely seamless for everyone involved has become a massive challenge. I wanted to solve this by creating a platform that feels incredibly premium, is surprisingly easy to use, and leverages cutting-edge AI to keep exams fair and secure.

---

## 🚀 How it Works

The platform is divided into two distinct experiences. Whether you are conducting an exam or taking one, the journey is built to be intuitive and engaging.

### 👨‍🏫 Conducting an Exam (Teacher's Perspective)
When a teacher or admin logs in, they gain access to a powerful dashboard where they can manage everything centrally:

1. **Creating the Exam**: Teachers can set up a new exam with a title, description, time limits, and passing marks. 
2. **AI-Powered Question Generation**: This is one of my favorite features. Instead of typing out every single question manually, teachers can **upload a theory PDF** or type in a simple topic. My AI will automatically read the syllabus and generate highly relevant multiple-choice questions in a matter of seconds!
3. **Scheduling & Publishing**: Teachers can schedule exactly when the exam will go live. Once they're ready, they pay a small hosting fee via a secure Razorpay gateway, and the exam is published.
4. **Unique Exam Codes**: Upon publishing, the system generates a unique 8-character code (for example, `PHYS-402`). The teacher can copy this code and share it with their students.
5. **Reviewing Results**: After the exam concludes, teachers can see a detailed breakdown of student scores, complete with the proctor's remarks, and even download professional PDF reports of the results.

### 👨‍🎓 Taking an Exam (Student's Perspective)
I wanted the student experience to be as stress-free as possible (well, aside from the actual test!):

1. **Simple Joining Process**: When a student logs into their dashboard, they are greeted with a prominent "Join Private Exam" card. They just type in the unique 8-character code their teacher gave them, and the exam is instantly added to their schedule.
2. **Live & Upcoming Sections**: The dashboard clearly separates exams that are "Live Now" from those that are "Scheduled", complete with a countdown and the exact start time.
3. **The Exam Interface**: Once the exam starts, students are put into a beautiful, distraction-free environment. There's a ticking timer, a grid to easily jump between questions, and an intuitive layout to review their answers before submitting.
4. **Leaderboards**: To make things a bit more engaging and competitive, students can see how they rank globally against other test-takers on the dynamic leaderboard.

---

### 🛡️ Ensuring Fairness (The AI Proctor)
To make sure exams are taken fairly without needing a human to watch over every single student, I built an advanced AI proctoring system that runs completely in the background:

- **Tab-Switching Detection**: If a student tries to open another tab or window to Google an answer, the system immediately catches it and issues a warning.
- **Vision & Movement Tracking**: Using their webcam, the AI constantly monitors the student's head movements. If they keep looking away from the screen, it meticulously flags the behavior.
- **Audio Monitoring**: The system continuously listens for suspicious background noise or volume spikes that might indicate someone in the room is helping them.
- *If a student racks up too many violations across these systems, the exam is automatically terminated!*

---

I put a massive amount of focus into making the design feel like a modern, premium SaaS product—expect soft shadows, glass-like elements, smooth animations, and a seamless flow throughout the entire journey. Welcome to **be-test**!
