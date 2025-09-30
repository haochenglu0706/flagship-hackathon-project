import { Router } from 'express';

const classes = Router();

async function fetchGraphQL(query, variables) {
  const result = await fetch('https://graphql.csesoc.app/v1/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  return result.json();
}

const query = `
  query MyQuery($course_code: String) {
    classes(
      where: { course: { course_code: { _eq: $course_code } }, term: { _eq: "T3" }, year: { _eq: "2025" } }
    ) {
      class_id
      mode
      status
      year
      course { course_code }
      times { weeks location time }
    }
  }
`;

classes.get('/:course_code', async (req, res, next) => {
  try {
    const { course_code: rawCourse } = req.params;
    const normalizedCourseCode = rawCourse.toUpperCase();
    const { data, errors } = await fetchGraphQL(query, { course_code: normalizedCourseCode });
    if (errors) return res.status(502).json({ errors });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default classes;