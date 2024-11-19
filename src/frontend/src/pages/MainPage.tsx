import Header from "../components/layout/Header";
import CardPagination from "../components/cards/CardPagination";
import axios from "axios";
import { useFetchPersonsData } from '../hooks/persons'

async function fetchPosts () {
  const data = await axios.get(
    ""
  )
}

function MainPage() {
  // const items = ["1 Item", "2 Item", "3 Item", "5 Item", "4 Item"];
  // const [posts, setPosts] = useState([]);

  // useEffect(() => {
  //   console.log("Fetching posts...");
  //   PostsService.getPosts().then((response) => {
  //     setPosts(response);
  //     console.log("Posts fetched:", response);
  //   });
  // }, []);

  // const request = useRequest()

  // const { data, isLoading, isError } = useQuery(
  //   {
  //     queryKey: ['USERS'],
  //     queryFn: async () => {
  //         const { data } = await request("https://jsonplaceholder.typicode.com/posts");
  //         return data;
  //     },
  //   });

    const { data, isLoading, isError } = useFetchPersonsData()
    
    if (isLoading) {
      return "... Loading"
    }

  return (
    <>
      <Header />
      <div className="container">
        {/* {data.map(
          (post: CardProps) =>
            <div className="pb-3"  key={post.id}>
              <Card title={post.title} body={post.body} id={post.id}/>
            </div>
        )} */}
        <CardPagination data={data} />
      </div>
    </>
  );
}

export default MainPage;
