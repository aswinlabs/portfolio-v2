import useIndiaTime from "@/hooks/useIndiaTime";

const Clock = () => {
  const { hour, minute, period } = useIndiaTime(true);

  return (
    <div className="text-md mr-2">
      {hour}:{minute} {period} IST
    </div>
  );
};

export default Clock;
