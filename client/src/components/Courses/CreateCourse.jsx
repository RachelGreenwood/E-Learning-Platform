export default function CreateCourse() {
    return (
        <div>
            <h1>Create Course</h1>
            <form>
                <div>
                    <label>Course Name: </label>
                    <input type="text" />
                </div>
                <div>
                    <label>Credits: </label>
                    <input type="number" />
                </div>
                <div>
                    <label>Prerequisites: </label>
                    <select>
                        <option>Test Option</option>
                    </select>
                </div>
                <div>
                    <label>Maximum Number of Students Allowed: </label>
                    <input type="number" />
                </div>
                <button type="submit">Create Course</button>
            </form>
        </div>
    )
}